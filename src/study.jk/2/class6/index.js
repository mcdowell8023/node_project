/*
 * @Author: mcdowell
 * @Date: 2020-05-08 14:20:13
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-09 05:26:02
 */

const http = require('http')
const fs = require('fs')

http
  .createServer((request, response) => {
    // 过滤默认行为 favicon 请求
    if (request.url === '/favicon.ico') {
      response.writeHead(200)
      response.end()
      return
    }
    console.log(request.url, 'request')
    response.writeHead(200)
    // fs.createReadStream(__dirname + '/index.html').pipe(response)
    // response.end('hi,http serve')
    const file = request.url === '/' ? 'index.html' : request.url
    fs.createReadStream(__dirname + '/www/' + file).pipe(response)
  })
  .listen(300)
