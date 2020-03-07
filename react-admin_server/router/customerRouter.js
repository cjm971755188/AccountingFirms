const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getCustomerList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer where name LIKE '%${params.name}%'`
  if (params.isAccount !== 'all') {
    sql = sql + ` and isAccount = ${params.isAccount}`
  }
  if (params.type !== 'all') {
    sql = sql + ` and type = ${params.type}`
  }
  if (params.state !== 'all') {
    sql = sql + ` and state = ${params.state}`
  }
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

router.post('/createCustomer', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM customer WHERE name = '${params.name}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: -1, data: {}, msg: '该客户公司已存在，不可重复添加！' })
    else {
      let sql = `INSERT INTO customer VALUES(null, '${params.ID}', '${params.name}', '${params.stid}', '${params.salary}', '${params.isAccount}', '${params.uid}', '${params.state}');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/editCustomer', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM customer WHERE cid = '${params.cid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: -1, data: {}, msg: '该客户公司不存在，不可修改信息！' })
    else {
      let sql = `UPDATE customer SET ID = '${params.ID}', name = '${params.name}', stid = '${params.stid}', salary = '${params.salary}', isAccount = '${params.isAccount}', uid = '${params.uid}' WHERE cid = ${params.cid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deleteCustomer', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM customer WHERE cid = '${params.cid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: -1, data: {}, msg: '该客户公司不存在，不可删除！' })
    else {
      let sql = `DELETE FROM customer WHERE cid = ${params.cid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

module.exports = router