/*
 * @Author: mcdowell
 * @Date: 2020-05-09 05:37:05
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-09 16:19:31
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
// express 路由形式 还有post 等等方式
app.get('/favicon.ico', function (requset, response) {
  // response.writeHead(200)
  // response.end()
  response.status(200)
  response.send()
  return
})

app.get('/game', function (requset, response) {
  // const parseUrl = url.parse(requset.url)
  // const { action } = querystring.parse(parseUrl.query)
  // express  内置已经 解好了 query ，直接使用就好
  const { action } = requset.query
  const gameResCode = game(action)

  // 耍赖机制
  if (count >= 3 || sameCount === 9999) {
    // http 简化
    // response.writeHead(500, charutf8)
    // response.end('不玩了')
    response.status(500)
    response.send('不玩了')
    return
  }
  count += gameResCode === -1 ? 1 : 0

  // 防止用户作弊机制
  if (playersameAction && playersameAction === gameResCode) {
    sameCount++
  }
  playersameAction = gameResCode
  if (sameCount >= 3) {
    // response.writeHead(400, charutf8)
    // response.end('你已经连续多次出得一样的了')
    // express 简化
    response.status(400)
    response.send('你已经连续多次出得一样的了')
    sameCount = 9999
    return
  }

  // 加入 Content-Type 结局中文乱码
  // response.writeHead(200, charutf8)
  response.status(200)
  if (gameResCode === 0) {
    // response.end('平局')
    // express 简化
    response.send('平局')
  }
  if (gameResCode === -1) {
    // response.end('你输了')
    // express 简化
    response.send('你输了')
  } else {
    // response.end('你赢了')
    response.send('你赢了')
  }
})

// 使用路由托管静态页面 【相对目录】
// app.use('/', express.static('www'))
// 使用路由托管静态页面 【绝对目录，更为稳妥】
// app.use(express.static(path.join(__dirname, 'www')))

// 通过 路由返回一个页面
app.get('/', function (requset, response) {
  // response.writeHead(200, {
  //   'Content-Type': 'text/html;charset=utf-8',
  // })
  // fs.createReadStream(__dirname + '/www/index.html').pipe(response)

  // 以上 返回文件的方式 可以直接 简化
  // 读取文件 发送就好 不用.pipe(response)
  // 不加入 类型说明，文件被识别为 buffer，不是字符串，会直接下载
  // 如果需要当成页面正常 访问，需要 加入 类型 ‘utf-8’
  response.status(200)
  response.send(fs.readFileSync(__dirname + '/www/index.html', 'utf-8'))
  // 也可以借助此种简单方式
  response.sendFile(__dirname + '/www/index.html')
})
app.listen(port)
