const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/getBusinessTypeList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM businesstype where name LIKE '%${params.name}%'`
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

router.post('/createBusinessType', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM businesstype WHERE btid = '${params.btid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该业务类型已存在，不可重复添加！' })
    else {
      let sql = `INSERT INTO businesstype VALUES(null, '${params.name}', '${params.description}');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/editBusinessType', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM businesstype WHERE btid = '${params.btid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该业务类型名称不存在，不可修改！' })
    else {
      let sql = `UPDATE businesstype SET name = '${params.name}', description = '${params.description}' where btid = '${params.btid}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deleteBusinessType', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM businesstype WHERE btid = '${params.btid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该业务类型不存在，不可删除！' })
    else {
      let q = `SELECT * FROM business WHERE btid = '${params.btid}'`
      db.query(q, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) res.send({ code: 200, data: {}, msg: `该业务类型现有${results.length}个业务使用，不可删除！` })
        else {
          let sql = `DELETE FROM businesstype WHERE btid = '${params.btid}'`
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.send({ code: 200, data: {}, msg: '' })
          })
          let sql2 = `DELETE FROM guide WHERE btid = '${params.btid}'`
          db.query(sql2, (err, results) => { if (err) throw err })
          let sql3 = `ALTER TABLE businesstype AUTO_INCREMENT = 1;`
          db.query(sql3, (err, results) => { if (err) throw err })
        }
      })
    }
  })
})

router.post('/getGuideList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM guide where btid = ${params.btid} ORDER BY step`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { data: results }, msg: '' })
  })
})

router.post('/createGuide', (req, res) => {
  let params = req.body
  if (params.type === 'self') {
    let sql = `UPDATE guide SET step = step + 1 where step >= ${params.step}`
    db.query(sql, (err, results) => { if (err) throw err })
  }
  let sql = `INSERT INTO guide VALUES(null, '${params.btid}', ${params.step}, '${params.color}', '${params.title}', '${params.detail}');`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: {}, msg: '' })
  })
})

router.post('/editGuide', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM guide WHERE gid = '${params.gid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该业务步骤不存在，不可修改！' })
    else {
      let sql = `UPDATE guide SET color = '${params.color}', title = '${params.title}', detail = '${params.detail}' where gid = '${params.gid}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deleteGuide', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM guide WHERE gid = '${params.gid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该业务步骤不存在，不可删除！' })
    else {
      let sql = `DELETE FROM guide WHERE gid = '${params.gid}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
      let sql2 = `UPDATE guide SET step = step - 1 where step >= ${params.step}`
      db.query(sql2, (err, results) => { if (err) throw err })
      let sql3 = `ALTER TABLE guide AUTO_INCREMENT = 1;`
      db.query(sql3, (err, results) => { if (err) throw err })
    }
  })
})

module.exports = router