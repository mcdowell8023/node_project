/*
 * @Author: mcdowell
 * @Date: 2020-05-17 21:19:06
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-18 22:49:31
 * 双工通信 -- 客户端
 * 客户端 服务端 相互任意通信
 * 必要 ：1. 包序号 seq
 */

const net = require('net')
// 解析 buffer
const protobuf = require('protocol-buffers')
const fs = require('fs')
const path = require('path')
const dataTemplte = protobuf(
  fs.readFileSync(__dirname + '/data.proto', 'utf-8')
)

const idArr = ['789182', '233439866', '222439175', '233181363']

const socket = new net.Socket({})

socket.connect({
  host: '127.0.0.1',
  port: 4000,
})

let seq = 0
const encodeParams = (id) => {
  // const buffer = Buffer.from(id)
  const buffer = Buffer.alloc(16)
  buffer.writeInt16BE(seq, 0)
  console.log(seq, 'seq--id', id)
  buffer.writeInt32BE(id, 2)
  seq++
  return buffer
}

const getData = () => {
  const index = Math.floor(Math.random() * idArr.length)
  const id = idArr[index]
  const buffer = encodeParams(id)
  socket.write(buffer)
}

// 双工通信  客户端随意发送
setInterval(getData, 500)
// 服务端 随意发送
socket.on('data', (buffer) => {
  const data = dataTemplte.data.decode(buffer)
  // 需要传入 seq 包序号，标记 请求及回执
  console.log('接收 服务端回执:', data.index, data.id, data.title)
})
