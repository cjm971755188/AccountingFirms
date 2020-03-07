const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getCustomerList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer where state = 'unlock' and name LIKE '%${params.name}%'`
  if (params.isAccount !== 'all') {
    sql = sql + ` and isAccount = '${params.isAccount}'`
  }
  if (params.ctid !== 'all') {
    sql = sql + ` and ctid = '${params.ctid}'`
  }
  if (params.credit !== 'all') {
    sql = sql + ` and credit = '${params.credit}'`
  }
  sql = sql + ` ORDER BY cid`
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
  let s = `SELECT * FROM customer WHERE ID = '${params.ID}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该客户公司已存在，不可重复添加！' })
    else {
      const time = (new Date()).valueOf();
      let sql = ''
      if (params.isAccount === '是') {
        sql = `INSERT INTO customer VALUES(null, '${params.ID}', '${params.name}', '${time}', '${params.ctid}', '${params.salary}', '${params.isAccount}', '${params.uid}', '${params.username}', '${params.uname}', '正常', 'unlock');`
      } else {
        sql = `INSERT INTO customer VALUES(null, '${params.ID}', '${params.name}', '${time}', '${params.ctid}', '${params.salary}', '${params.isAccount}', '', '', '', '正常', 'unlock');`
      }
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
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该客户公司不存在，不可修改信息！' })
    else {
      let sql = ''
      if (params.isAccount === '是') {
        sql = `UPDATE customer SET ID = '${params.ID}', name = '${params.name}', ctid = '${params.ctid}', salary = '${params.salary}', isAccount = '${params.isAccount}', uid = '${params.uid}', username = '${params.username}', uname = '${params.uname}' WHERE cid = ${params.cid};`
      } else {
        sql = `UPDATE customer SET ID = '${params.ID}', name = '${params.name}', ctid = '${params.ctid}', salary = '${params.salary}', isAccount = '${params.isAccount}', uid = '', username = '', uname = '' WHERE cid = ${params.cid};`
      }
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
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该客户公司不存在，不可删除！' })
    else {
      let sql = `UPDATE customer SET state = 'lock' WHERE cid = '${params.cid}';`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/didPay', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM customer WHERE cid = '${params.cid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该客户公司不存在，不可结算酬金！' })
    else {
      let sql = `UPDATE customer SET credit = '正常' WHERE cid = ${params.cid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/getCustomerTypes', (req, res) => {
  let sql = `SELECT * FROM customerType`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { customerTypes: results }, msg: '' })
  })
})

module.exports = router