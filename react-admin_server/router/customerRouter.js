const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getCustomerList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer where state = 'unlock' and name LIKE '%${params.name}%'`
  if (params.uid && params.uid !== '') {
    sql = sql + ` and uid = '${params.uid}'`
  }
  if (params.progress && params.progress !== 'all') {
    sql = sql + ` and progress = '${params.progress}'`
  }
  if (params.ctid && params.ctid !== 'all') {
    sql = sql + ` and ctid = '${params.ctid}'`
  }
  if (params.credit && params.credit !== 'all') {
    sql = sql + ` and debt > 0`
  }
  if (params.progress && params.progress !== 'all') {
    sql = sql + ` and progress = '${params.progress}'`
  }
  sql = sql + ` ORDER BY cid`
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
    let sql = `SELECT * FROM customerType`
    db.query(sql, (err, results) => {
      if (err) throw err;
      for (let i = 0; i < _results.length; i++) {
        for (let j = 0; j < results.length; j++) {
          if (_results[i].ctid === results[j].ctid) {
            _results[i]['ctName'] = results[j].name
          }
        }
      }
      let sql = `SELECT * FROM salary`
      db.query(sql, (err, results) => {
        if (err) throw err;
        for (let i = 0; i < _results.length; i++) {
          for (let j = 0; j < results.length; j++) {
            if (_results[i].sid === results[j].sid) {
              _results[i]['salary'] = results[j].salary
            }
          }
        }
        let sql = `SELECT * FROM user`
        db.query(sql, (err, results) => {
          if (err) throw err;
          for (let i = 0; i < _results.length; i++) {
            for (let j = 0; j < results.length; j++) {
              if (_results[i].uid === results[j].uid) {
                _results[i]['uName'] = results[j].name
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
  })
})

router.post('/createCustomer', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer WHERE ID = '${params.ID}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该客户公司已存在，不可重复添加！' })
    else {
      const time = (new Date()).valueOf();
      let sql = `INSERT INTO customer VALUES(null, '${params.ID}', '${params.name}', ${time}, '${params.ctid}', '${params.sid}', '${params.linkName}', '${params.linkPhone}', '${params.uid}', 0, ${time}, 0, 0, '未完成', 0, 0, 0, 'unlock');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/editCustomer', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM salary WHERE sid = '${params.sid}' and ctid = '${params.ctid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '结算类型与结算酬金冲突，请确认选择！' })
    else {
      let sql = `SELECT * FROM customer WHERE cid = '${params.cid}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length === 0) res.send({ code: 200, data: {}, msg: '该客户公司不存在，不可修改信息！' })
        else {
          let sql = `UPDATE customer SET ID = '${params.ID}', name = '${params.name}', ctid = '${params.ctid}', sid = '${params.sid}', linkName = '${params.linkName}', linkPhone = '${params.linkPhone}', uid = '${params.uid}' WHERE cid = ${params.cid};`
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.send({ code: 200, data: {}, msg: '' })
          })
        }
      })
    }
  })
})

router.post('/deleteCustomer', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer WHERE cid = '${params.cid}'`
  db.query(sql, (err, results) => {
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

router.post('/didComplete', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer WHERE cid = '${params.cid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该客户公司不存在，不可结算酬金！' })
    else {
      const time = (new Date()).valueOf();
      let sql = `UPDATE customer SET progress = '已完成', didTime = ${time} WHERE cid = ${params.cid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/didPay', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer WHERE cid = '${params.cid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该客户公司不存在，不可结算酬金！' })
    else {
      const time = (new Date()).valueOf();
      let sql = `UPDATE customer SET debt = debt - ${params.pay}, cPay = cPay + ${params.pay}, payTime = ${time} WHERE cid = ${params.cid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        let sql = `UPDATE user SET pay = pay + ${params.pay} WHERE uid = ${params.uid};`
        db.query(sql, (err, results) => {
          if (err) throw err;
          res.send({ code: 200, data: {}, msg: '' })
        })
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

router.post('/getSalarys', (req, res) => {
  let params = req.body
  let sql = ''
  if (params.ctid) { 
    sql = `SELECT * FROM salary where ctid = '${params.ctid}'` 
  } else { 
    sql = `SELECT * FROM salary`
  }
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { salarys: results }, msg: '' })
  })
})

router.post('/getUsers', (req, res) => {
  let sql = `SELECT * FROM user`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { users: results }, msg: '' })
  })
})

module.exports = router