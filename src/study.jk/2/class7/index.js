/*
 * @Author: mcdowell
 * @Date: 2020-05-09 05:37:05
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-09 21:46:23
 */
const http = require('http')
const fs = require('fs')
const url = require('url')
const querystring = require('querystring')
const game = require('./lib/game')

let charutf8 = {
  'Content-Type': 'text/html;charset=utf-8',
}
// 针对用户 业务
let count = 0
let sameCount = 0
let playersameAction = null

http
  .createServer((requset, response) => {
    // 进行格式化 url http://nodejs.cn/api/url.html
    const parseUrl = url.parse(requset.url)
    // 过滤非必要的 请求/favicon.ico
    if (parseUrl.pathname === '/favicon.ico') {
      response.writeHead(200)
      response.end()
      return
    }
    // game 接口业务逻辑
    if (parseUrl.pathname === '/game') {
      // query:
      const { action } = querystring.parse(parseUrl.query)
      const gameResCode = game(action)

      // 耍赖机制
      if (count >= 3 || sameCount === 9999) {
        response.writeHead(500, charutf8)
        response.end('不玩了')
        return
      }
      // 防止用户作弊机制
      playersameAction = gameResCode
      if (playersameAction && playersameAction === gameResCode) {
        sameCount++
      }

      if (sameCount >= 3) {
        response.writeHead(400, charutf8)
        response.end('你已经连续多次出得一样的了')
        sameCount = 9999
        return
      }

      // 加入 Content-Type 结局中文乱码
      response.writeHead(200, charutf8)
      if (gameResCode === 0) {
        response.end('平局')
      }
      if (gameResCode === -1) {
        response.end('你输了')
      } else {
        response.end('你赢了')
        count++
      }
    }
    if (parseUrl.pathname === '/') {
      response.writeHead(200, {
        'Content-Type': 'text/html;charset=utf-8',
      })
      // 取得文件流 通过管道方式 喂给 response 返回包 给浏览器
      fs.createReadStream(__dirname + '/www/index.html').pipe(response)
      // response.end('123')
    }
  })
  .listen(3000)
