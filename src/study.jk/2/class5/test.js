/*
 * @Author: mcdowell
 * @Date: 2020-05-08 05:26:52
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-08 06:00:45
 */

// console.log(
//   (async function () {
//     // return 4
//     throw new Error(6)
//   })()
// )

// console.log(
//   (function () {
//     return new Promise((resolve, reject) => {
//       // resolve(4)
//       reject(new Error(6))
//     })
//   })()
// )

// 从上面来看，两者相等

function getError() {
  throw new Error('fail---getError')
}

async function getAsyncPromise(params) {
  if (params) {
    return params
  }
  throw new Error('fail---getAsyncPromise')
}

async function getData() {
  let res = null
  try {
    // await getError()

    // res = await getAsyncPromise()
    res = await new Promise((resolve, reject) => {
      // resolve({ name: '张三', age: '22' })
      reject(new Error('fail'))
    })
  } catch (error) {
    console.log('error:', error.message)
  }
  console.log(res, 'getData--结果')
  // return 'end'
}

console.log(getData(), 'getData')
