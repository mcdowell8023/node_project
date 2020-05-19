/*
 * @Author: mcdowell
 * @Date: 2020-05-17 21:18:53
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-19 10:38:54
 * 双工通信  -- 服务端
 * 客户端 服务端 相互任意通信
 */
/* 测试数据 */

const dataList = [
  {
    id: '789182',
    title: '票友圈装优雅不叫真优雅，想要表里如一得这样',
    type: '家电',
  },
  {
    type: null,
    title: '云米互联网烟灶Flash套装，开启高效智能厨房生活',
    id: '233439866',
  },
  {
    type: '数码',
    title: '爱国者BW01智能手表评测：机械魅力融合科技，优雅随行',
    id: '222439175',
  },
  {
    type: null,
    title: '多功能应用的智能电视，是客厅的中心家庭的欢乐',
    id: '233181363',
  },
]

// 解析 buffer
const protobuf = require('protocol-buffers')
const fs = require('fs')
const path = require('path')
const dataTemplte = protobuf(
  fs.readFileSync(__dirname + '/data.proto', 'utf-8')
)

const net = require('net')
// net 模块用于创建基于流的 TCP 或 IPC 的服务器（net.createServer()）与客户端（net.createConnection()）。
const port = 4000

const server = net.createServer((socket) => {
  socket.on('erro', (err) => {
    console.log('socket err')
    // throw err
  })

  let oldBuffer = null
  socket.on('data', (resbuffer) => {
    // 把上一次data事件使用残余的buffer接上来
    // let buffer = resbuffer
    if (oldBuffer) {
      resbuffer = Buffer.concat([oldBuffer, resbuffer])
    }
    let completeLength = 0

    // console.log(resbuffer, '--buffer')
    // 只要还存在可以解成完整包的包长
    while ((completeLength = checkComplete(resbuffer))) {
      // console.log(resbuffer, 'buffer--')
      const package = resbuffer.slice(0, completeLength)
      resbuffer = resbuffer.slice(completeLength)

      // 把这个包解成数据和seq
      // 解码
      const { seq, id } = decodeParams(package)
      console.log(seq, 'seq, id', id)
      // 查重 拼接 数据
      const item = dataList.filter((item) => item.id == id)[0]
      item.index = seq
      console.log(id, '--item:', item)
      // 编码 数据
      const buffer = encode(seq, item)
      setTimeout(() => {
        socket.write(buffer)
      }, 50000 * Math.random())
      console.log(`包${seq}，返回值是`, item)
    }

    // 把残余的buffer记下来
    oldBuffer = resbuffer
  })
})

server.on('error', (err) => {
  console.log(err)
})

server.listen(port, () => {
  console.log(`RPC server is running at port ${port}.`)
})

// 解码 参数
const decodeParams = (buffer) => {
  // 一般来说，一个rpc调用的数据包会分为定长的包头和不定长的包体两部分
  // 包头的作用就是用来记载包的序号和包的长度，以实现全双工通信
  const header = buffer.slice(0, 6)
  console.log(header, 'header')
  const seq = header.readInt16BE()
  const body = buffer.slice(6)
  return {
    seq,
    id: body.toString(),
  }
}
// 数据包 编码
const encode = (seq, data) => {
  const header = Buffer.alloc(6)
  // 写入 包序号
  header.writeInt16BE(seq, 0)
  const body = dataTemplte.data.encode(data)
  // 写入 body 长度
  header.writeInt32BE(body.length, 2)
  // 拼接 包头包体
  const buffer = Buffer.concat([header, body])
  return buffer
}
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
