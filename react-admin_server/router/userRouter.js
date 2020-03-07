const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/login', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where username = '${params.username}' ORDER BY uid`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.send({ code: 200, data: {}, msg: '该账号不存在！' })
    } else if (results.length > 1) {
      res.send({ code: 200, data: {}, msg: '系统数据库错误，请找开发人员沟通解决！' })
    } else {
      if (results[0].password !== params.password) {
        res.send({ code: 200, data: {}, msg: '密码错误，登录失败！' })
      } else {
        if (results[0].state === 'lock') {
          res.send({ code: 200, data: {}, msg: '该账号已锁定，请找管理员沟通解决！' })
        } else {
          res.send({
            code: 200,
            data: { 
              uid: results[0].uid,
              username: results[0].username,
              name: results[0].name,
              mid: results[0].mid,
              absent: results[0].absent,
              state: results[0].state,
            },
            msg: ''
          })
        }
      }
    }
  })
})

module.exports = router