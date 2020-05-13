/*
 * @Author: mcdowell
 * @Date: 2020-05-09 22:40:10
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-11 10:04:57
 */
const express = require('express')
const api = express.Router()
const game = require('./lib/game')
// 针对用户 业务
let count = 0
let sameCount = 0
let playersameAction = null

// 使用洋葱中间件 next 分开隔离代码，便于维护
api.get(
  '/game',
  function (requset, response, next) {
    const { action } = requset.query
    // 游戏结果 存入 response 方便调用
    response.gameResCode = game(action)
    next()
  },
  function (requset, response, next) {
    // 耍赖机制
    if (count >= 3 || sameCount === 9999) {
      response.status(500)
      response.send('不玩了')
    }

    next()
    // 通过一个 next 下面 的都执行后，继续回到这个点 ，继续执行以下代码
    // 这便是所谓的 洋葱机制  通过next 穿入穿出 从外皮到内，再到外
    // 用户赢了++
    if (response.playerWon) {
      count++
    }
  },
  function (requset, response, next) {
    // 防止用户作弊机制
    if (playersameAction && playersameAction === response.gameResCode) {
      sameCount++
    }
    playersameAction = response.gameResCode
    if (sameCount >= 3) {
      response.status(400)
      response.send('你已经连续多次出得一样的了')
      sameCount = 9999
    }
    next()
  },
  function (requset, response) {
    // 这里仅仅处理结果
    response.status(200)
    if (response.gameResCode === 0) {
      response.send('平局')
    } else if (response.gameResCode === -1) {
      response.send('你输了')
    } else {
      response.send('你赢了')
      response.playerWon = true
    }
  }
)

module.exports = api
