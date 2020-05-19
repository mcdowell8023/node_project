/*
 * @Author: mcdowell
 * @Date: 2020-05-17 21:19:06
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-18 21:59:18
 * 半 双工通信 -- 客户端
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

const socket = new net.Socket({})

socket.connect({
  host: '127.0.0.1',
  port: 4000,
})

const getData = () => {
  const index = Math.floor(Math.random() * idArr.length)
  const id = idArr[index]

  // const buffer = Buffer.from(id)
  const buffer = Buffer.alloc(16)
  buffer.writeInt32BE(id)
  // console.log(index, id, 'id,buffer', buffer)
  socket.write(buffer)
}
// socket.write('这是单工通信!\r\n')
// 单工通信 ； 单纯由一方发起，且需等待对方回执后，在进行下一次的请求
getData()
socket.on('data', (buffer) => {
  console.log(
    '接收 服务端回执:',
    // buffer.toString())
    dataTemplte.data.decode(buffer)
  )

  getData()
})
