/*
 * @Author: mcdowell
 * @Date: 2020-05-09 22:17:45
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-09 22:57:20
 */
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200)
  // 也可以借助此种简单方式 [返回对应固定文件]
  res.sendFile(__dirname + '/web/index.html')
})
router.get('/one', (req, res) => {
  res.send('one')
})
router.get('/second', (req, res) => {
  res.send('second')
})
router.get('/treen', (req, res) => {
  res.send('treen')
})

module.exports = router
