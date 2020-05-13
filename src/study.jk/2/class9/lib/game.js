/*
 * @Author: mcdowell
 * @Date: 2020-05-12 22:05:59
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-12 22:05:59
 */
module.exports = function (playerAction) {
  // 根据 随机数 随机 给出电脑 给出答案
  var random = Math.random() * 3
  var computerAction = random < 1 ? 'rock' : random > 2 ? 'scissors' : 'paper'

  // 进行比较
  if (playerAction === computerAction) {
    console.log(
      `playerAction:${playerAction} computerAction:${computerAction},平局`
    )
    return 0
  } else if (
    (playerAction === 'rock' && computerAction === 'paper') ||
    (playerAction === 'paper' && computerAction === 'scissors') ||
    (playerAction === 'scissors' && computerAction === 'rock')
  ) {
    console.log(
      `playerAction:${playerAction} computerAction:${computerAction},你赢了`
    )
    return -1
  } else {
    console.log(
      `playerAction:${playerAction} computerAction:${computerAction},你输了`
    )
    return 1
  }
}
