/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

export function filterObj(obj, arr) {
  // console.log('obj', obj)
  // console.log('arr', arr)
  if (typeof obj !== 'object' || !Array.isArray(arr)) {
    throw new Error('filterObj 参数格式不正确！')
  } else {
    const result = {}
    Object.keys(obj)
      .filter(key => arr.includes(key))
      .forEach(key => {
        result[key] = obj[key]
      })
    return result
  }
}

// 获取视口宽高
export function getViewportOffset() {
  if (window.innerWidth) {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    }
  } else {
    if (document.compatMode === 'BackCompat') {
      return {
        w: document.body.clienWidth,
        h: document.body.clientHeight
      }
    } else {
      return {
        w: document.documentElement.clientWidth,
        h: document.documrntElement.clientHeight
      }
    }
  }
}

// 设置图标
export function setFileIcon(ext) {
  if (!ext) {
    return 'wenjian'
  }
  const map = {
    txt: ['txt'],
    wendang: ['doc', 'docx'],
    excel: ['xls', 'xlsx'],
    ppt: ['ppt', 'pptx'],
    tupian: ['jpg', 'jpeg', 'png'],
    pdf: ['pdf'],
    shiping: ['flv', 'rmvb', 'mp4', 'mvb'],
    yinping: ['wma', 'mp3'],
    yasuobao: ['rar', 'zip']
  }
  const result = Object.keys(map).find(key => map[key].includes(ext))
  if (!result) {
    return 'weizhi'
  }
  return result
}

// 设置文件大小
export function setFileSize(size) {
  if (!size) {
    return '--'
  }
  const level = ['B', 'KB', 'MB', 'GB', 'TB']
  let num = 0
  while (Math.floor(size / 1024) > 0) {
    size = size / 1024
    num++
  }
  return size.toFixed(2) + level[num]
}

