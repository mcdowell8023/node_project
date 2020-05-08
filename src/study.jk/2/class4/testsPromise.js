/*
 * @Author: mcdowell
 * @Date: 2020-05-07 06:19:25
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-07 07:41:14
 */

const promise = new Promise((reslove, reject) => {
  setTimeout(() => {
    reslove('成功')
    // reject(new Error('失败'))
  }, 100)
})
  .then((res) => {
    console.log('结果:', res)
  })
  .catch((error) => {
    console.log(error, 'error---发生了失败')
  })

console.log(promise, 'promise')

setTimeout(() => {
  console.log(promise, 'promise-800')
}, 200)
