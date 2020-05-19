/*
 * @Author: mcdowell
 * @Date: 2020-05-17 21:18:53
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-17 23:57:13
 * 单工通信 -- 服务端
 */

const net = require('net')
// net 模块用于创建基于流的 TCP 或 IPC 的服务器（net.createServer()）与客户端（net.createConnection()）。
const port = 4000

const server = net.createServer((socket) => {
  socket.on('erro', (err) => {
    console.log('socket err')
    // throw err
  })

  socket.on('data', (resBuffer) => {
    const id = resBuffer.toString()
    console.log('我接到的id--', id)
  })
})

server.on('error', (err) => {
  throw err
})

server.listen(port, () => {
  console.log(`RPC server is running at port ${port}.`)
})
