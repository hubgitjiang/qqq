// 专门处理 localstroage 的操作

// 获取 localstroage
export function getLocal (key) {
  return window.localStorage.getItem(key)
}

// 保存 localstroage
export function setLocal (key, value) {
  window.localStorage.setItem(key, value)
}

// 删除 localstroage
export function removeLocal (key) {
  window.localStorage.removeItem(key)
}
