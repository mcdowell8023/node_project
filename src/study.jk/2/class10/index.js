/*
 * @Author: mcdowell
 * @Date: 2020-05-14 14:44:14
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-14 15:11:47
 */
// 创建  长度为 8位 的  buffer
const buffer1 = Buffer.alloc(8)
// string 默认用 utf8 编码
const buffer2 = Buffer.alloc(16, 'test')
// 创建 32位 用 1 填充
const buffer3 = Buffer.alloc(16, 1)
const buffer4 = Buffer.alloc(16, 1)

console.log(buffer1, 'buffer1')
console.log(buffer2, 'buffer2')
console.log(buffer3, 'buffer3')
console.log(buffer4, 'buffer4')

// 使用 什么 编码，就用什么 解码
console.log(buffer2.toString('utf8'))
// 从数组 或者字符串 创建 buffer
const buf1 = Buffer.from([0, 1, 2, 3, 4, 5])
console.log('buf1', buf1)
const buf2 = Buffer.from('string')
console.log('buf2', buf2)

// Int8 没有大端序 小端序 因为只有两位
buffer1.writeInt8(14, 1)
console.log(buffer1, 'buffer1.readInt8', buffer1.readInt8(1))

// readInt16BE() 读取为大端序[高位在前] readInt16LE() 读取为小端序[高位在后]

buffer3.writeInt16BE(12, 1)
buffer3.writeInt16LE(24, 5)
// buf.writeInt16BE(value[, offset])
// buf.writeInt16LE(value[, offset])
console.log(
  buffer3,
  'buffer3.readInt16BE / readInt16LE',
  buffer3.readInt16BE(1),
  buffer3.readInt16LE(5)
)
// 你可看到 Int16 占 2组 4位

buffer4.writeInt32BE(12, 1)
buffer4.writeInt32LE(24, 5)
// buf.writeInt16BE(value[, offset])
// buf.writeInt16LE(value[, offset])
// 你可看到 Int32 占 4组 8位
console.log(
  buffer4,
  'buffer4.readInt32BE / readInt32LE',
  buffer4.readInt32BE(1),
  buffer4.readInt32LE(5)
)

// 编码数据 就是 一位一位对应 写入数据：
const buffer = Buffer.alloc(32)
buffer.writeInt8(18, 1) // 占用 1 个
buffer.writeInt16BE(36, 2) // 占用 2 个
buffer.writeInt16BE(512, 4) // 占用 2 个
buffer.writeInt32BE(512, 5) // 占用 8

console.log(buffer, 'buffer')
/*
 ***
 ****
 *****
 ****** 分
 ******* 割 **************************
 ****** 线
 *****
 ****
 ***
 */
console.log(`/*
***
****
*****
****** 分
******* 割 **************************
****** 线
*****
****
***
*/`)
// protocol-buffers https://www.npmjs.com/package/protocol-buffers
// 借助 protocol-buffers 进行 buffer 读写
// 1. 需要新建 test.proto 文件 定义格式
// 2. 引入包
const protobuf = require('protocol-buffers')
const fs = require('fs')
// 3. 导入 配置 文件
const messages = protobuf(fs.readFileSync(__dirname + '/test.proto', 'utf-8'))
// 写入buffer
const newBufMessage = messages.Info.encode({
  id: 42,
  name: '碎花洋群',
  price: 80.2,
})
console.log(newBufMessage, '写入--newBufMessage')
// 读取buffer
console.log(messages.Info.decode(newBufMessage), '读取--newBufMessage')
