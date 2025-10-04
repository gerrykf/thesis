// 移动端rem适配方案
export function setRem(): void {
  const baseSize = 16 // 设计稿基准字体大小
  const designWidth = 375 // 设计稿宽度
  const deviceWidth = document.documentElement.clientWidth || window.innerWidth

  // 计算缩放比例，最大不超过设计稿尺寸
  const scale = Math.min(deviceWidth / designWidth, 1)

  // 设置根字体大小
  const rootFontSize = baseSize * scale
  document.documentElement.style.fontSize = rootFontSize + 'px'

  // 设置body字体大小为14px，避免继承问题
  document.body.style.fontSize = '0.875rem'
}

// 防抖函数
function debounce(func: Function, wait: number) {
  let timeout: number | undefined
  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = undefined
      func(...args)
    }
    if (timeout !== undefined) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait) as unknown as number
  }
}

// 初始化和监听窗口变化
export function initFlexible(): void {
  setRem()

  // 监听窗口大小变化
  const debouncedSetRem = debounce(setRem, 100)
  window.addEventListener('resize', debouncedSetRem as EventListener)
  window.addEventListener('orientationchange', debouncedSetRem as EventListener)

  // 监听字体大小变化
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      setRem()
    }
  })
}
