const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getPermissionList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM permission where name LIKE '%${params.name}%'`
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

router.post('/createPermission', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM permission WHERE name = '${params.name}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: -1, data: {}, msg: '该权限已存在，不可重复添加！' })
    else {
      let sql = `INSERT INTO permission VALUES(null, '${params.name}');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deletePermission', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM permission WHERE mid = '${params.mid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: -1, data: {}, msg: '该权限不存在，不可删除！' })
    else {
      let sql = `DELETE FROM permission WHERE mid = '${params.mid}';`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

module.exports = router