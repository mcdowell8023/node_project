/*
 * @Author: mcdowell
 * @Date: 2020-05-09 05:37:05
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-09 22:16:33
 * 使用 express 实现 http 版本 石头剪刀布
 */
const express = require('express')
const app = express()
const fs = require('fs')
var path = require('path')
const url = require('url')
const querystring = require('querystring')
const game = require('./lib/game')

const charutf8 = {
  'Content-Type': 'text/html;charset=utf-8',
}
const port = 8090

// 针对用户 业务
let count = 0
let sameCount = 0
let playersameAction = null

app.get('/favicon.ico', function (requset, response) {
  response.status(200)
  response.send()
  return
})

// 使用洋葱中间件 next 分开隔离代码，便于维护
app.get(
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
      return
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
      return
    }
    next()
  },
  function (requset, response) {
    // 这里仅仅处理结果
    /* 
     为了演示 next 不完善的地方
     临时注释
    response.status(200)
    if (response.gameResCode === 0) {
      response.send('平局')
    } else if (response.gameResCode === -1) {
      response.send('你输了')
    } else {
      response.send('你赢了')
      response.playerWon = true
    } */
    /* 
    
      这里模拟了一个异步返回的情况
      你会发现代码失效了
      这也是 next 目前存在的问题

      因为 setTimeout 或 异步请求，是在另外的事件循环内，
      【见到 setTimeout 内容会被临时挂起，先去执行 主调用栈 「playerWon的值还没有」， 
      在500 后，在回过头来 执行当前 即时playerWon变了，可是 上面 count++ 也已经早已执行完毕了  】
    */
    setTimeout(() => {
      response.status(200)
      console.log(response, 'response')
      if (response.gameResCode === 0) {
        response.send('平局')
      } else if (response.gameResCode === -1) {
        response.send('你输了')
      } else {
        response.send('你赢了')
        response.playerWon = true
      }
    }, 500)
  }
)

// 使用路由托管静态页面 【相对目录】
// app.use('/', express.static('www'))
// 使用路由托管静态页面 【绝对目录，更为稳妥】
// app.use(express.static(path.join(__dirname, 'www')))

// 通过 路由返回一个页面
app.get('/', function (requset, response) {
  response.status(200)
  // 也可以借助此种简单方式 [返回对应固定文件]
  response.sendFile(__dirname + '/www/index.html')
})
app.listen(port)
