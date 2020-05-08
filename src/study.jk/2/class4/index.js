/*
 * @Author: mcdowell
 * @Date: 2020-05-07 06:19:25
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-07 09:41:01
 */

Promise.all([interview('腾讯'), interview('百度'), interview('阿里')])
  .then((res) => {
    // 全部成功才会进入
    console.log('smaile', res)
  })
  .catch((error) => {
    // console.log(error)
    // 多个失败 只接收 第一个失败的
    console.log('cry at ' + error.round + ' ')
  })

function interview(round) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      const random = Math.random() > 0.2
      if (random) {
        reslove(round + ':success')
        // console.log('reslove--执行')
      } else {
        console.log(round, 'round')
        const error = new Error('fail')
        error.round = round
        reject(error)
      }
    }, 100)
  })
}

// setTimeout(() => {
//   promise
//     .then((res) => {
//       console.log(res, 'promise--then')
//       // return res
//     })
//     .catch((error) => {
//       // console.log(error, 'promise--catch')
//       console.log('cry at ' + error.round + ' round')

//       return 'error'
//     })

//   // console.log(promise, 'promise--')
// }, 800)

// 链式写法
// const promise = interview(1) // 1 面
//   .then(() => {
//     return interview(2) // 2 面
//   })
//   .then(() => {
//     return interview(3) // 3 面
//   })
//   .then((res) => {
//     // 三轮 成功
//     console.log('smaile', res)
//   })
//   .catch((error) => {
//     console.log('cry at ' + error.round + ' round')
//   })

// 并行  发起请求还是串行的，毕竟node是单线程执行。但等待请求的过程是并行的
