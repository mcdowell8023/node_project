/*
 * @Author: mcdowell
 * @Date: 2020-05-05 14:58:13
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-09 06:42:20
 * 使用commonjs 方式  提取游戏模块 编写 电脑 输三次 结束进程 的 猜拳
 */
var game = require('./game')
// var playerAction = process.argv[process.argv.length - 1]

// const res = game(playerAction)
// console.log(res, '游戏结果')

// var count = 0
// count += res
let count = 0
// http://nodejs.cn/api/process.html#process_process_stdin
process.stdin.on('data', (e) => {
  const playerAction = e.toString().trim()

  const result = game(playerAction)
  // 计数
  count += result === -1 ? 1 : 0
  console.log(count, '游戏结果')
  if (count === 3) {
    console.log('总是你赢，不玩了')
    process.exit()
  }
})
