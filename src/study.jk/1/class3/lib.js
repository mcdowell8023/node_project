console.log('this is lib ')

exports.hello = 'world'
// commonjs  默认注入 exports 变量
// 可以 支持挂载 变量、对象、方法
exports.add = function (a, b) {
  return a + b
}
exports.geek = {
  name: 'mcdoell',
}

// 这里在导出的 会被覆盖
module.exports = {
  say: function () {
    return `说话`
  },
}

setTimeout(() => {
  console.log(
    module.exports,
    `\n----\n这里为了测试 外部是否可以改值\n---\n`,
    exports
  )
}, 2000)

// webpack --devtool none --mode development --target node index.js

/* 

module.exports 与 exports 默认都是 {} ,指向同一块内存，

当用户使用，module.exports 进行修改， 那么 require 的引用也跟着改变【 require 其实一直引入的是 module.exports 】




*/
