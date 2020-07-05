<template>
  <div class="app-container select-course">
    <!-- 查询 -->
    <div class="filter-container">
      <div v-desktop>
        <el-input
          v-model="listQuery.teachingTaskAlias"
          placeholder="教学任务别称"
          style="width: 200px;"
          size="small"
          class="filter-item"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="small"
          round
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
        <el-button
          class="filter-item fr"
          type="primary"
          size="small"
          round
          @click="handleChange"
        >
          {{ !state ? '已选' : '选课' }}
        </el-button>
      </div>
      <MobileTop v-model="listQuery.teachingTaskAlias" v-mobile placeholder="请输入教学别称" @search="getList">
        <el-button class="btn" round type="primary" @click="handleChange">
          <svg-icon icon-class="qiehuan" />
          {{ !state ? '已选' : '选课' }}
        </el-button>
      </MobileTop>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="small"
      highlight-current-row
      style="width: 100%;"
      :height="tableHeight"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
        :index="indexMethod"
      />
      <el-table-column label="教学任务别称" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.teachingTaskAlias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开课学期" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.term }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任课老师" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.teacher.teaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学分" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.course.courseCredit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="80"
        class-name="small-padding fixed-width"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-button
            v-if="!state"
            size="mini"
            type="primary"
            round
            @click="selectCourse(row)"
          >
            选课
          </el-button>
          <el-button
            v-else
            size="mini"
            type="danger"
            round
            @click="unselectCourse(row)"
          >
            退选
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div v-desktop>
      <pagination
        v-show="total>0"
        :total="total"
        :page-sizes="[8, 16, 32, 64]"
        :page.sync="listQuery.currentPage"
        :limit.sync="listQuery.pageSize"
        class="fr"
        @pagination="setPagination"
      />
    </div>

  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import MobileTop from '@/components/MobileTop'
import { axiosGet, axiosPost } from '@/utils/axios'
import { getViewportOffset } from '@/utils/index'
import {
  GET_SELECTED_COURSE_LIST,
  GET_UNSELECTED_COURSE_LIST,
  SELECT_COURSE,
  UNSELECT_COURSE
} from '@/api/url'

export default {
  name: 'SelectCourse',
  components: { Pagination, MobileTop },
  directives: { waves },
  data() {
    return {
      total: 0,
      listLoading: true,
      tableKey: 0,
      list: null, // 表格数据
      state: 0, // 0-未选, 1-已选
      listQuery: {
        currentPage: 1,
        pageSize: this.$store.getters.device === 'mobile' ? 1000 : 8,
        teachingTaskAlias: ''
      }
    }
  },
  computed: {
    isMobile() {
      return this.$store.getters.device === 'mobile'
    },
    tableHeight() {
      const height = getViewportOffset().h
      // console.log('height', height)
      if (this.isMobile) {
        return height - 182 + 'px'
      } else {
        return null
      }
    }
  },
  created() {
    // 初始化查询表
    this.getPagePars()
    this.getList()
  },
  methods: {
    getPagePars() {
      const { pagePars } = this.$store.getters
      const path = this.$route.path + '/' + this.state
      // console.log('path', path)
      if (pagePars.has(path)) {
        const { currentPage, pageSize, filter } = pagePars.get(path)
        // console.log('currentPage', currentPage)
        this.listQuery = {
          currentPage,
          pageSize,
          teachingTaskAlias: filter.teachingTaskAlias
        }
        return true
      } else {
        return false
      }
    },
    savePagePars() {
      const path = this.$route.path + '/' + this.state
      const pars = {
        currentPage: this.listQuery.currentPage,
        pageSize: this.listQuery.pageSize,
        filter: {
          teachingTaskAlias: this.listQuery.teachingTaskAlias
        }
      }
      this.$store.dispatch('pagePars/savePagePars', { path, pars })
    },
    open(test) {
      return this.$confirm(test, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    async selectCourse(row) {
      const { id, teachingTaskAlias, term } = row
      const teaName = row.teacher.teaName
      try {
        await this.open(`确定选择 ${teaName} 老师的 [${term}]${teachingTaskAlias}?`)
        await axiosPost(SELECT_COURSE, { teachingTaskId: id })
        this.$message.success('选课成功')
        this.getList()
      } catch (e) {
        () => {}
      }
    },
    async unselectCourse(row) {
      const { id, teachingTaskAlias, term } = row
      const teaName = row.teacher.teaName
      try {
        await this.open(`确定退选 ${teaName} 老师的 [${term}]${teachingTaskAlias}?`)
        await axiosPost(UNSELECT_COURSE, { teachingTaskId: id })
        this.$message.success('退选成功')
        this.getList()
      } catch (e) { () => {} }
    },
    handleChange() {
      this.state = this.state === 0 ? 1 : 0
      const result = this.getPagePars()
      // console.log('result', result)
      if (!result) {
        this.listQuery.currentPage = 1
        this.resetListQuery()
      }
      this.getList()
    },
    resetListQuery() {
      this.listQuery.teachingTaskAlias = ''
    },
    getList() {
      this.savePagePars()
      this.listLoading = true
      const url = !this.state ? GET_UNSELECTED_COURSE_LIST : GET_SELECTED_COURSE_LIST
      axiosGet(url, { params: this.listQuery })
        .then(response => {
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
  .btn {
    padding: 0 5px;
    margin-left: 5px;
    line-height: 30px;
  }
}
</style>
<style lang="scss">
.app-container {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .el-select {
    width: 100%;
    height: '';
  }
}
</style>
