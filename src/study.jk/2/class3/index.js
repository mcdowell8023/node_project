/*
 * @Author: mcdowell
 * @Date: 2020-05-06 06:55:30
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-07 06:50:42
 */

function interview(callback) {
  setInterval(() => {
    const random = Math.random() < 0.8
    // callback(random ? 'success' : 'fail')
    if (random) {
      // error-first callback 规范 错误放到最前面
      callback(null, 'success')
    } else {
      // 关于 事件循环 调用站(callstack) 问题
      // 此处错误 会导致全局崩溃
      // throw new Error('fail')

      callback(new Error('fail'))
    }
  }, 500)
}

/*
 * 回掉函数 callback 的使用
 */
try {
  interview(function (res) {
    if (res) {
      //res instanceof Error
      return console.log('cry')
    }
    console.log('smile', res)
  })
} catch (error) {
  console.log(error, 'fial')
}

/*
 ***
 ****
 *****
 ****** 分
 ******* 割 **************************
 ****** 线
 *****
 ****
 ***
 */

// 异步流程控制  回掉函数问题
// 1. 回掉地狱 [层层嵌套的回掉函数 ，可读性非常差]
// interview(function (error) {
//   if (error) {
//     return console.log('cry at 1st round')
//   }
//   interview(function (error) {
//     if (error) {
//       return console.log('cry at 2nd round')
//     }
//     interview(function (error, res) {
//       if (error) {
//         return console.log('cry at 3rd round')
//       }
//       console.log('smile', res)
//     })
//   })
// })
//  2.异步并发
// var count = 0

// interview(function (error) {
//   if (error) {
//     count--
//     return console.log('cry')
//   }
//   // 同样的业务 需要编写重复代码
//   count++
//   if (count > 2) {
//     console.log('smile', count)
//   }
// })

// interview(function (error) {
//   if (error) {
//     count--
//     return console.log('cry')
//   }
//   // 同样的业务 需要编写重复代码
//   count++
//   if (count > 2) {
//     console.log('smile', count)
//   }
// })
