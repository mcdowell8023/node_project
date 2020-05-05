/*
 * @Author: mcdowell
 * @Date: 2020-05-05 18:08:18
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-05 18:10:01
 */
const events = require('events').EventEmitter
class studyDocCenter extends events {
  constructor() {
    super()
    setInterval(() => {
      this.emit('getStudyDoc', {
        size: Math.random() * 1000,
        url: 'https://www.baidu.com',
      })
    }, 2000)
  }
}

module.exports = studyDocCenter
