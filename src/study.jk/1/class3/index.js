console.log('start require')

const lib = require('./lib')
console.log(lib, 'lib value')
console.log('end require')
// 强行外部改值
lib.addtest = '我是测试'
lib.hello = '你好'
