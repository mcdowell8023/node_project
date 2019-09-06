'use strict'
// 引入内置模块
const http = require('http');
// 创建 http 服务
http.createServer((req,res)=>{
  let status = 200;
  // 设置 code码 请求头
  res.writeHead(status,{'Content-Type':'text/plain'});
  // 发送数据
  res.end('hello Node.js\n');
})
// 指定 端口 和 ip地址
.listen(3000,'127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');