<template>
  <div class="app-container personal">
    <el-scrollbar :style="{height: '100%'}">
      <el-row :gutter="20">
        <el-col :span="8" :xs="24">
          <user-card />
        </el-col>
        <el-col :span="16" :xs="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>修改密码</span>
            </div>
            <el-form ref="pwdForm" :model="pwdForm" :rules="rules" label-position="top" class="pwdForm">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="pwdForm.oldPassword" type="password" placeholder="请输入原密码" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="pwdForm.newPassword" type="password" placeholder="请输入新密码" />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="pwdForm.confirmPassword" type="password" placeholder="再输入一次新密码" />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="isloading"
                  class="submit fr"
                  @click="resetPwd('pwdForm')"
                >提交</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import { UPDATE_PWD_URL } from '@/api/url'
import { mapActions } from 'vuex'
import { axiosPost } from '@/utils/axios'
export default {
  name: 'Personal',

  components: {
    UserCard
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isloading: false,
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '长度至少为6个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {

  },

  watch: {},

  created() {

  },

  beforeMount() {},

  mounted() {},

  methods: {
    ...mapActions({
      'logout': 'user/logout'
    }),
    submitForm() {

    },
    getPwd() {
      // eslint-disable-next-line no-unused-vars
      const { userInfo } = this.$store.getters
    },
    resetPwd(formName) {
      // 1. 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 2. 发送请求
          this.isloading = true
          axiosPost(UPDATE_PWD_URL, this.pwdForm)
            .then(response => {
              this.$message({
                type: 'success',
                message: '密码更新成功,跳转登录页面'
              })
              this.isloading = false
              this.logout()
                .then(() => {
                  this.$router.push('/login')
                })
            })
            .catch(() => {
              this.isloading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}

</script>
<style lang='scss' scoped>
.personal {
  ::v-deep .el-form-item__label {
    line-height: 20px;
    font-weight: normal;
    font-size: 14px;
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 992px){
  .personal {
    .submit {
      width: 100%;
      padding: 6px 0;
    }
  }
}
</style>
