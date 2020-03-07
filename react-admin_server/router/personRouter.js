const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getPersonList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where state = 'unlock' and pid != '1' and username LIKE '%${params.username}%' and name LIKE '%${params.name}%'`
  if (params.pid !== 'all') {
    sql = sql + ` and pid = '${params.pid}'`
  }
  if (params.absent !== 'all') {
    sql = sql + ` and absent = '${params.absent}'`
  }
  sql = sql + ` ORDER BY uid`
  db.query(sql, (err, results) => {
    if (err) throw err;
    let _results = []
    if (results.length > params.pageSize) {
      for (let i = 0; i < params.pageNum; i++) {
        let temp = results
        _results = temp.slice(i*params.pageSize, (i+1)*params.pageSize)
      }
    } else {
      _results = results
    }
    res.send({
      code: 200,
      data: { data: _results, pageNum: params.pageNum, pageSize: params.pageSize, total: results.length },
      msg: ''
    })
  })
})

router.post('/createPerson', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM user WHERE phone = '${params.phone}'`
  db.query(s, (err, r) => {
    if (err) throw err;
    if (r.length !== 0) res.send({ code: 200, data: {}, msg: '该员工账号（手机号）已存在，不可重复添加！' })
    else {
      let q = `SELECT username FROM user ORDER BY uid DESC limit 1`
      db.query(q, (err, result) => {
        if (err) throw err;
        const id = Number(result[0].username.slice(3,8)) + 1
        const username = 'JMG' + (id/Math.pow(10,5)).toFixed(5).substr(2)
        const startTime = (new Date()).valueOf();
        let sql = `INSERT INTO user VALUES(null, '${username}', '123456', '${params.name}', '${params.sex}', '${params.phone}', '${startTime}', '${params.pid}', '${params.mid}', '在班', 'unlock');`
        db.query(sql, (err, results) => {
          if (err) throw err;
          res.send({ code: 200, data: { username }, msg: '' })
        })
      })
    }
  })
})

router.post('/editPerson', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(s, (err, r) => {
    if (err) throw err;
    if (r.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可修改信息！' })
    else {
      let sql = `UPDATE user SET name = '${params.name}', sex = '${params.sex}', phone = '${params.phone}', pid = '${params.pid}', mid = '${params.mid}' WHERE uid = ${params.uid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deletePerson', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(s, (err, r) => {
    if (err) throw err;
    if (r.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可删除！' })
    else {
      let sql = `UPDATE user SET state = 'lock' WHERE uid = '${params.uid}';`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/getPositions', (req, res) => {
  let sql = `SELECT * FROM position where pid != '1'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { positions: results }, msg: '' })
  })
})

router.post('/getPermissions', (req, res) => {
  let sql = `SELECT * FROM permission`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { permissions: results }, msg: '' })
  })
})

module.exports = router