/*
 * @Author: mcdowell
 * @Date: 2020-05-17 21:19:06
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-17 23:57:51
 * 单工通信 -- 客户端
 * 只有 客户端发送给 服务端
 */

const net = require('net')
// 解析 buffer
const protobuf = require('protocol-buffers')
const fs = require('fs')
const path = require('path')
const dataTemplte = protobuf(
  fs.readFileSync(path.join(__dirname, '../') + '/data.proto', 'utf-8')
)

const idArr = ['789182', '233439866', '222439175', '233181363']

const socket = net.createConnection('4000', (server) => {
  console.log(server, 'server')
  // 'connect' 监听器
  const index = Math.floor(Math.random() * idArr.length)
  const id = idArr[index]
  console.log('已连接到服务器')
  setInterval(() => {
    console.log(`发送Id-- ${id}`)
    socket.write(id)
  }, 800)
})
