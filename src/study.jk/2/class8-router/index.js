/*
 * @Author: mcdowell
 * @Date: 2020-05-09 05:37:05
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-09 23:12:53
 * 使用 express 实现 http 版本 石头剪刀布
 */
const express = require('express')
const app = express()
const router = require('./router')
var path = require('path')
const api = require('./api')

/* 
app.use(path,callback)中的callback既可以是router对象又可以是函数
app.get(path,callback)中的callback只能是函数
当一个路由有好多个子路由时用app.use(path,router)
*/

const port = 8090
// 页面路由
app.use('/', router)
// 使用路由托管静态页面 【相对目录】
app.use('/public', express.static('public'))
// 使用路由托管静态页面 【绝对目录，更为稳妥】
app.use('/static', express.static(path.join(__dirname, 'static')))
// api 后面都是请求接口
app.use('/api', api)

app.get('/about', function (requset, response) {
  response.status(200)
  response.send('这是一个 express 展示项目')
})
app.use(function (req, res, next) {
  res.status(404).send('抱歉啊，网页丢了!')
})

app.listen(port, function () {
  console.log(`app is running at port ${port}.`)
})
