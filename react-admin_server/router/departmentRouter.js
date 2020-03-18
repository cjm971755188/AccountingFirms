const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getDepartmentList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM department where did != '0' and name LIKE '%${params.name}%'`
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

router.post('/createDepartment', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM department WHERE name = '${params.name}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: -1, data: {}, msg: '该部门职位已存在，不可重复添加！' })
    else {
      let sql = `INSERT INTO department VALUES(null, '${params.name}', '${params.description}', '${params.permission}');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/editDepartment', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM department WHERE name = '${params.name}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: -1, data: {}, msg: '该部门职位不存在，不可修改！' })
    else {
      let sql = `UPDATE department SET name = '${params.name}', description = '${params.description}', permission = '${params.permission}' where did = '${params.did}';`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deleteDepartment', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM department WHERE did = '${params.did}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: -1, data: {}, msg: '该部门职位不存在，不可删除！' })
    else {
      let sql = `DELETE FROM department WHERE did = '${params.did}';`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
      let sql2 = `ALTER TABLE department AUTO_INCREMENT = 1;`
      db.query(sql2, (err, results) => { if (err) throw err })
    }
  })
})

module.exports = router