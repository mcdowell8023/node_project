# 读狼叔 nodejs 学习笔记

- [1.node.js 理论](./doc/1.node.js理论.md)
- [2.起步](./doc/2.起步.md)

## 临时工具

```js
function getAllContents(tag = '.content') {
  // 看书工具函数
  let arr = document.querySelectorAll(tag)
  let contents = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    contents.push(item.textContent)
  }
  const str = contents.toString()
  // console.log(str,'i')
  console.log(contents.join('\r\n'), '：以上为获取的全部内容')
}
```
