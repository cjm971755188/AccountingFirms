const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where username LIKE '%${params.username}%' and name LIKE '%${params.name}%'`
  /* if (params.pid !== 'all') {
    sql = sql + ` and pid = ${params.pid}`
  }
  if (params.state !== 'all') {
    sql = sql + ` and state = ${params.state}`
  } */
  /* db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length > params.pageSize) {
      for (let i = 0; i < params.pageNum; i++) {
        let temp = results
        _results = temp.slice(i*params.pageSize, (i+1)*params.pageSize)
      }
    }
    res.send({
      code: 200,
      data: { data: _results, pageNum: params.pageNum, pageSize: params.pageSize, total: results.length },
      msg: ''
    })
  }) */
  res.send({
    code: 200,
    data: { },
    msg: ''
  })
})

router.post('/create', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM user WHERE username = '${params.username}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results) res.send({ code: -1, data: {}, msg: '该员工账号已存在，不可重复添加！' })
    else {
      let sql = `INSERT INTO user (uid, username, password, name, sex, phone, startTime, pid, mid, state) VALUES(null, '${params.username}', '123456', '${params.name}', '${params.sex}', '${params.phone}', '${params.startTime}', '${params.pid}', '${params.mid}', '${params.state}');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/edit', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (!results) res.send({ code: -1, data: {}, msg: '该员工账号不存在，不可修改信息！' })
    else {
      let sql = `UPDATE user SET name = '${params.name}', sex = '${params.sex}', phone = '${params.phone}', pid = '${params.pid}', mid = '${params.mid}' WHERE uid = ${params.uid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/delete', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (!results) res.send({ code: -1, data: {}, msg: '该员工账号不存在，不可删除！' })
    else {
      let sql = `DELETE FROM user WHERE uid = ${params.uid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

module.exports = router