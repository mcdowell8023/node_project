/*
 * @Author: mcdowell
 * @Date: 2020-05-05 17:59:16
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-05 18:30:06
 * 内置事件 观察者 模式示例
 */
const studyDocCenter = require('./lib')

const studyer = new studyDocCenter()

studyer.addListener('getStudyDoc', (data) => {
  console.log('接收消息：', data)
})
