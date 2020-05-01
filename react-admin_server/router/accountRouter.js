const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getAccountList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where username LIKE '%${params.username}%' and name LIKE '%${params.name}%'`
  if (params.did !== 'all') {
    sql = sql + ` and did = '${params.did}'`
  }
  if (params.pType !== 'all') {
    sql = sql + ` and pType = '${params.pType}'`
  }
  if (params.state !== 'all') {
    sql = sql + ` and state = '${params.state}'`
  }
  sql = sql + ` ORDER BY uid`
  db.query(sql, (err, results) => {
    if (err) throw err;
    let Results = results, _results = []
    if (results.length > params.pageSize) {
      for (let i = 0; i < params.pageNum; i++) {
        _results = Results.slice(i*params.pageSize, (i+1)*params.pageSize)
      }
    } else {
      _results = results
    }
    let sql = `SELECT * FROM department`
    db.query(sql, (err, results) => {
      if (err) throw err;
      for (let i = 0; i < _results.length; i++) {
        for (let j = 0; j < results.length; j++) {
          if (_results[i].did === results[j].did) {
            _results[i]['dName'] = results[j].name
          }
        }
      }
      res.send({
        code: 200,
        data: { data: _results, pageNum: params.pageNum, pageSize: params.pageSize, total: Results.length },
        msg: ''
      })
    })
  })
})

router.post('/create', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE phone = '${params.phone}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该账号（手机号）已存在，不可重复添加！' })
    else {
      let sql = `SELECT username FROM user ORDER BY uid DESC limit 1`
      db.query(sql, (err, results) => {
        if (err) throw err;
        let id = Number(results[0].username.slice(3,8)) + 1
        let sql = `SELECT * FROM department where did = '${params.did}'`
        db.query(sql, (err, results) => {
          const username = 'JMG' + (id/Math.pow(10,5)).toFixed(5).substr(2)
          const startTime = (new Date()).valueOf();
          let sql = `SELECT * FROM department WHERE did = '${params.did}'`
          db.query(sql, (err, results) => {
            if (err) throw err;
            let sql = ''
            if (params.pType === '默认') {
              sql = `INSERT INTO user VALUES(null, '${username}', '123456', '${params.name}', '${params.sex}', '${params.phone}', '${startTime}', '${params.did}', '${params.pType}', '${results[0].permission}', '在班', 0, 'unlock')`
            } else if (params.permission === results[0].permission) {
              sql = `INSERT INTO user VALUES(null, '${username}', '123456', '${params.name}', '${params.sex}', '${params.phone}', '${startTime}', '${params.did}', '默认', '${params.permission}', '在班', 0, 'unlock')`
            } else {
              sql = `INSERT INTO user VALUES(null, '${username}', '123456', '${params.name}', '${params.sex}', '${params.phone}', '${startTime}', '${params.did}', '${params.pType}', '${params.permission}', '在班', 0, 'unlock')`
            }
            db.query(sql, (err, results) => {
              if (err) throw err;
              res.send({ code: 200, data: { username }, msg: '' })
            })
          })
        })
      })
    }
  })
})

router.post('/changePermissions', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可修改信息！' })
    else {
      let sql = `SELECT * FROM department WHERE did = '${params.did}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        let sql = ''
        if (params.pType === '默认') {
          sql = `UPDATE user SET pType = '${params.pType}', permission = '${results[0].permission}' WHERE uid = ${params.uid};`
        } else if (params.permission === results[0].permission) {
          sql = `UPDATE user SET pType = '默认', permission = '${params.permission}' WHERE uid = ${params.uid};`
        } else {
          sql = `UPDATE user SET pType = '${params.pType}', permission = '${params.permission}' WHERE uid = ${params.uid};`
        }
        db.query(sql, (err, results) => {
          if (err) throw err;
          res.send({ code: 200, data: {}, msg: '' })
        })
      })
    }
  })
})

router.post('/resetPassWord', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可修改信息！' })
    else {
      let sql = `UPDATE user SET password = '123456' WHERE uid = ${params.uid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/lockOrUnlock', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可修改信息！' })
    else {
      let sql = ''
      if (params.flag === 'lock') {
        sql = `UPDATE user SET state = 'lock' WHERE uid = ${params.uid};`
      } else {
        sql = `UPDATE user SET state = 'unlock' WHERE uid = ${params.uid};`
      }
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/getDepartments', (req, res) => {
  let sql = `SELECT * FROM department WHERE did != 0`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { departments: results }, msg: '' })
  })
})

module.exports = router