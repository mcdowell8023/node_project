/*
 * @Author: mcdowell
 * @Date: 2020-05-17 21:19:06
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-19 10:36:35
 * 双工通信 -- 客户端
 * 客户端 服务端 相互任意通信
 * 必要 ：1. 包序号 seq
 */

const net = require('net')
const idArr = ['789182', '233439866', '222439175', '233181363']

// 解析 buffer
const protobuf = require('protocol-buffers')
const fs = require('fs')
const path = require('path')
const dataTemplte = protobuf(
  fs.readFileSync(__dirname + '/data.proto', 'utf-8')
)

const socket = new net.Socket({})
socket.connect({
  host: '127.0.0.1',
  port: 4000,
})

let seq = 0
// 编码 参数
const encodeParams = (id) => {
  // 一般来说，一个rpc调用的数据包会分为定长的包头和不定长的包体两部分
  // 包头的作用就是用来记载包的序号和包的长度，以实现全双工通信
  const header = Buffer.alloc(6)
  // 写入 包序号
  header.writeInt16BE(seq, 0)
  const body = Buffer.from(id)
  // 写入 body 长度
  header.writeInt32BE(body.length, 2)
  // 拼接 包头包体
  const buffer = Buffer.concat([header, body])

  seq++
  return buffer
}
// 解码 回执
function decode(buffer) {
  const header = buffer.slice(0, 6)
  const seq = header.readInt16BE()
  const body = buffer.slice(6)
  return {
    seq,
    data: dataTemplte.data.decode(body),
  }
}

const getData = () => {
  const index = Math.floor(Math.random() * idArr.length)
  const id = idArr[index]
  const buffer = encodeParams(id)
  socket.write(buffer)
}

// 双工通信  客户端随意发送
for (let i = 0; i < 100; i++) {
  getData()
}

let oldBuffer = null
socket.on('data', (buffer) => {
  // 把上一次data事件使用残余的buffer接上来
  if (oldBuffer) {
    buffer = Buffer.concat([oldBuffer, buffer])
  }
  let completeLength = 0
  // 只要还存在可以解成完整包的包长
  while ((completeLength = checkComplete(buffer))) {
    const package = buffer.slice(0, completeLength)
    buffer = buffer.slice(completeLength)
    const { seq, data } = decode(package)
    // 需要传入 seq 包序号，标记 请求及回执
    console.log('接收 服务端回执:', seq, data.id, data.title)
  }
  // 把残余的buffer记下来
  oldBuffer = buffer
})

/**
 * 检查一段buffer是不是一个完整的数据包。
 * 具体逻辑是：判断header的bodyLength字段，看看这段buffer是不是长于header和body的总长
 * 如果是，则返回这个包长，意味着这个请求包是完整的。
 * 如果不是，则返回0，意味着包还没接收完
 * @param {} buffer
 */
function checkComplete(buffer) {
  if (buffer.length < 6) {
    return 0
  }
  const bodyLength = buffer.readInt32BE(2)
  return 6 + bodyLength
}
