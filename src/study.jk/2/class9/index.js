/*
 * @Author: mcdowell
 * @Date: 2020-05-12 21:27:11
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-12 22:51:24
 */

const koa = require('koa')
const mount = require('koa-mount')
const fs = require('fs')
const game = require('./lib/game')

const charutf8 = {
  'Content-Type': 'text/html;charset=utf-8',
}
const port = 8090

// 针对用户 业务
let count = 0
let sameCount = 0
let playersameAction = null

const app = new koa()

app.use(
  // mount 会返回 koa 中间件
  mount('/favicon.ico', function (context) {
    context.status = 200
    context.body = ''
    return
  })
)

const gameKoa = new koa()
// mount 仅接受一个实例 或者 一个koa
gameKoa.use(async function (context, next) {
  const { action } = context.query
  // 游戏结果 存入 response 方便调用
  context.gameResCode = game(action)
  await next()
})
gameKoa.use(async function (context, next) {
  // 耍赖机制
  if (count >= 3 || sameCount === 9999) {
    context.status = 500
    context.body = '不玩了'
    return
  }

  await next()
  if (context.playerWon) {
    count++
  }
})
gameKoa.use(async function (context, next) {
  // 防止用户作弊机制
  if (playersameAction && playersameAction === context.gameResCode) {
    sameCount++
  }

  playersameAction = context.gameResCode
  if (sameCount >= 3) {
    context.status = 400
    context.body = '你已经连续多次出得一样的了'
    sameCount = 9999
    return
  }
  await next()
})
gameKoa.use(async function (context) {
  console.log(444)

  console.log(context.gameResCode, 'context.gameResCode')
  await new Promise((reslove) => {
    setTimeout(() => {
      context.status = 200
      if (context.gameResCode === 0) {
        context.body = '平局'
      } else if (context.gameResCode === -1) {
        context.body = '你输了'
      } else {
        context.body = '你赢了'
        context.playerWon = true
      }
      reslove()
    }, 500)
  })
})

app.use(mount('/game', gameKoa))
// 使用洋葱中间件 next 分开隔离代码，便于维护

app.use(
  mount('/', function (context) {
    context.status = 200
    context.body = fs.readFileSync(__dirname + '/www/index.html', 'utf-8')
    return
  })
)
app.listen(port)
