/*
 * @Author: mcdowell
 * @Date: 2020-05-17 21:18:53
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-18 22:43:30
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

const encodeParams = (id) => {
  // const buffer = Buffer.from(id)
  const buffer = Buffer.alloc(16)
  buffer.writeInt32BE(seq++)
  return buffer.writeInt32BE(id, 2)
}

const server = net.createServer((socket) => {
  socket.on('erro', (err) => {
    console.log('socket err')
    // throw err
  })

  socket.on('data', (resBuffer) => {
    try {
      // 切分 buffer
      const seq = resBuffer.slice(0, 2).readInt16BE(0)
      const id = resBuffer.readInt32BE(2)
      const item = dataList.filter((item) => item.id == id)[0]
      //
      item.index = seq
      console.log(id, '--item:', item)

      const buffer = dataTemplte.data.encode(item)
      setTimeout(() => {
        socket.write(buffer)
      }, 50000 * Math.random())
    } catch (error) {
      console.log(error, '--error')
    }
  })
})

server.on('error', (err) => {
  throw err
})

server.listen(port, () => {
  console.log(`RPC server is running at port ${port}.`)
})
