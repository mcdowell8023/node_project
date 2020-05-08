/*
 * @Author: mcdowell
 * @Date: 2020-05-05 18:37:12
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-05 18:45:45
 */
const glob = require('glob')

/* 阻塞 方式 通过glob 递归获取全部路径 */
// console.time()
// const result = glob.sync(__dirname + '/**/*')
// console.log(result, 'result')
// console.timeEnd()

/* 非阻塞 方式 */
let result = null
console.time()
glob(__dirname + '/**/*', function (err, res) {
  // console.log(err, res, 'err,res')
  result = res
  console.log('result 得到结果')
})
console.timeEnd()
console.log('这句话应该在结果，才说明是非阻塞的')
