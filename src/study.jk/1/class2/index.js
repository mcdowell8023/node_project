/*
 * @Author: mcdowell
 * @Date: 2020-05-05 10:20:35
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-05 10:42:47
 * rock paper scissors
 * 石头剪刀布
 */

// 通过 process.arge 获得 用户 答案
// console.log(process.argv)
var playerAction = process.argv[process.argv.length - 1]
// 根据 随机数 随机 给出电脑 给出答案
var random = Math.random() * 3
var computerAction = random < 1 ? 'rock' : random > 2 ? 'scissors' : 'paper'

// 进行比较
if (playerAction === computerAction) {
  console.log(
    `playerAction:${playerAction} computerAction:${computerAction},平局`
  )
} else if (
  (playerAction === 'rock' && computerAction === 'paper') ||
  (playerAction === 'paper' && computerAction === 'scissors') ||
  (playerAction === 'scissors' && computerAction === 'rock')
) {
  console.log(
    `playerAction:${playerAction} computerAction:${computerAction},你赢了`
  )
} else {
  console.log(
    `playerAction:${playerAction} computerAction:${computerAction},你输了`
  )
}
