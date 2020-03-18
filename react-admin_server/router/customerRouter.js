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
      let sql = ''
      if (params.isAccount === '是') {
        sql = `INSERT INTO customer VALUES(null, '${params.ID}', '${params.name}', ${time}, '${params.ctid}', '${params.sid}', '${params.linkName}', '${params.linkPhone}', '${params.isAccount}', '${params.uid}', '正常', 0, 'unlock');`
      } else {
        sql = `INSERT INTO customer VALUES(null, '${params.ID}', '${params.name}', ${time}, '${params.ctid}', '${params.sid}', '${params.linkName}', '${params.linkPhone}', '${params.isAccount}', '', '正常', 0, 'unlock');`
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
  if (params.isAccount === '是' && params.uid === 0) {
    res.send({ code: 200, data: {}, msg: '若该公司确认做账，负责会计不得为空！' })
  } else {
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
            let sql = ''
            if (params.isAccount === '是') {
              sql = `UPDATE customer SET ID = '${params.ID}', name = '${params.name}', ctid = '${params.ctid}', sid = '${params.sid}', linkName = '${params.linkName}', linkPhone = '${params.linkPhone}', isAccount = '${params.isAccount}', uid = '${params.uid}' WHERE cid = ${params.cid};`
            } else {
              sql = `UPDATE customer SET ID = '${params.ID}', name = '${params.name}', ctid = '${params.ctid}', sid = '${params.sid}', linkName = '${params.linkName}', linkPhone = '${params.linkPhone}', isAccount = '${params.isAccount}', uid = '' WHERE cid = ${params.cid};`
            }
            db.query(sql, (err, results) => {
              if (err) throw err;
              res.send({ code: 200, data: {}, msg: '' })
            })
          }
        })
      }
    })
  }
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

router.post('/didPay', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer WHERE cid = '${params.cid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该客户公司不存在，不可结算酬金！' })
    else {
      let sql = `UPDATE customer SET credit = '正常', count = 0 WHERE cid = ${params.cid};`
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