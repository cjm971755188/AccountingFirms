const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getCustomerTypeList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customertype where name LIKE '%${params.name}%'`
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

router.post('/createCustomerType', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM customertype WHERE ctid = '${params.ctid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该结算类型已存在，不可重复添加！' })
    else {
      let sql = `INSERT INTO customertype VALUES(null, '${params.name}', '${params.description}');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/editCustomerType', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM customertype WHERE ctid = '${params.ctid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该结算类型名称不存在，不可修改！' })
    else {
      let sql = `UPDATE customertype SET name = '${params.name}', description = '${params.description}' where ctid = '${params.ctid}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deleteCustomerType', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM customertype WHERE ctid = '${params.ctid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该结算类型的酬金金额不存在，不可删除！' })
    else {
      let q = `SELECT * FROM customer WHERE ctid = '${params.ctid}'`
      db.query(q, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) res.send({ code: 200, data: { count: result.length }, msg: '该结算类型仍有客户公司使用，不可删除！' })
        else {
          let sql = `DELETE FROM customertype WHERE ctid = '${params.ctid}'`
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.send({ code: 200, data: {}, msg: '' })
          })
          let _sql = `ALTER TABLE customertype AUTO_INCREMENT = 1;`
          db.query(_sql, (err, results) => { if (err) throw err })
        }
      })
    }
  })
})

router.post('/getSalaryList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM salary where ctid = '${params.ctid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { data: results }, msg: '' })
  })
})

router.post('/createSalary', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM salary WHERE ctid = '${params.ctid}' and salary = '${params.salary}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该酬金类型已存在，不可重复添加！' })
    else {
      let sql = `INSERT INTO salary VALUES(null, '${params.ctid}', '${params.ctName}', '${params.salary}');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/editSalary', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM salary WHERE ctid = '${params.ctid}' and salary = '${params.salary}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该酬金金额已存在，不可修改！' })
    else {
      let sql = `UPDATE salary SET salary = '${params.salary}' where sid = '${params.sid}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deleteSalary', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM salary WHERE sid = '${params.sid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该结算类型的酬金金额不存在，不可删除！' })
    else {
      let q = `SELECT * FROM customer WHERE sid = '${params.sid}'`
      db.query(q, (err, results) => {
        if (err) throw err;
        if (results.length !== 0) res.send({ code: 200, data: {}, msg: `仍有${results.length}个客户公司使用该结算类型的酬金金额，不可删除！` })
        else {
          let sql = `DELETE FROM salary WHERE sid = '${params.sid}'`
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.send({ code: 200, data: {}, msg: '' })
          })
          let _sql = `ALTER TABLE salary AUTO_INCREMENT = 1;`
          db.query(_sql, (err, results) => { if (err) throw err })
        }
      })
    }
  })
})

module.exports = router