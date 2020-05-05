/*
 * @Author: mcdowell
 * @Date: 2020-05-04 17:59:46
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-05 14:56:48
 * 初识  全局 对象
 */

console.log('heoll world!')

console.log(Date)
console.log(Math)

console.log(setInterval)
console.log(setTimeout)

// requestAnimationFrame api 是浏览器的下一针
// console.log(requestAnimationFrame)
// 定时器的一种，类似于 代替 浏览器 requestAnimationFrame
console.log(setImmediate)
// 当前文件的 路径
console.log(__filename)
// 当前文件的 路径目录
console.log(__dirname)

// 进程对对象  包含node 信息，系统，cpu 、环境变量 等信息  。。。
console.log(process)
// 捕捉用户命令（argv）
console.log(process.argv)
