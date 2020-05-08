/*
 * @Author: mcdowell
 * @Date: 2020-05-08 06:06:13
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-08 09:34:46
 * 改写前面的 面试过程模拟函数
 */
function interview(round) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      const random = Math.random() > 0.2
      if (random) {
        reslove(round + ':success')
        // console.log('reslove--执行')
      } else {
        const error = new Error('fail')
        error.round = round
        reject(error)
      }
    }, 100)
  })
}
// 串行
// ;(async function () {
//   try {
//     await interview(1)
//     console.log('good', 1)
//     await interview(2)
//     console.log('good', 2)
//     await interview(3)
//     console.log('good', 3)
//     await interview(4)
//     console.log('全都 成了')
//   } catch (error) {
//     console.log('哦，失败了', 'cry at ' + error.round + ' ')
//   }
// })()

// 并行
;(async function () {
  try {
    await Promise.all([interview('腾讯'), interview('百度'), interview('阿里')])
  } catch (error) {
    // 多个失败 只接收 第一个失败的
    console.log('cry at ' + error.round + ' ')
  }
})()
