const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/login', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where username = '${params.username}' ORDER BY uid`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.send({ code: 200, data: {}, msg: '该账号不存在！' })
    } else if (results.length > 1) {
      res.send({ code: 200, data: {}, msg: '系统数据库错误，请找开发人员沟通解决！' })
    } else {
      if (results[0].password !== params.password) {
        res.send({ code: 200, data: {}, msg: '密码错误，登录失败！' })
      } else {
        if (results[0].state === 'lock') {
          res.send({ code: 200, data: {}, msg: '该账号已锁定，请找管理员沟通解决！' })
        } else {
          res.send({
            code: 200,
            data: { 
              "uid": results[0].uid,
              "username": results[0].username,
              "name": results[0].name,
              "sex": results[0].sex,
              "phone": results[0].phone,
              "did": results[0].did,
              "permission": results[0].permission,
              "absent": results[0].absent,
              "state": results[0].state,
              "change": results[0].password === '123456' ? 1 : 0
            },
            msg: ''
          })
        }
      }
    }
  })
})

router.post('/getPermissions', (req, res) => {
  let sql = `SELECT * FROM permission`
  db.query(sql, (err, results) => {
    if (err) throw err;
    let permissions = []
    for (let i = 0; i < results.length; i++) {
      if (results[i].layer === 1) {
        let m = { title: results[i].title, key: String(results[i].pid), children: [] }
        for (let j = 0; j < results.length; j++) {
          if (results[j].father === results[i].pid) {
            m.children.push({ title: results[j].title, key: String(results[j].pid) })
          }
        }
        if (m.children.length === 0) {
          permissions.push({ title: results[i].title, key: String(results[i].pid) })
        } else {
          permissions.push(m)
        }
      }
    }
    res.send({ code: 200, data: { permissions: permissions }, msg: ''})
  })
})

router.post('/getMenus', (req, res) => {
  let params = req.body
  let _params = params.permission.split("/")
  let sql = `SELECT * FROM permission`
  db.query(sql, (err, results) => {
    if (err) throw err;
    let _results = []
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < _params.length; j++) {
        if (results[i].pid === Number(_params[j])) {
          _results.push(results[i])
        }
      }
    }
    let menus = []
    for (let i = 0; i < _results.length; i++) {
      if (_results[i].layer === 1) {
        let m = { title: _results[i].title, icon: _results[i].icon, path: _results[i].path, children: [] }
        for (let j = 0; j < _results.length; j++) {
          if (_results[j].father === _results[i].pid) {
            m.children.push({ title: _results[j].title, icon: _results[j].icon, path: _results[j].path })
          }
        }
        if (m.children.length === 0) {
          menus.push({ title: _results[i].title, icon: _results[i].icon, path: _results[i].path })
        } else {
          menus.push(m)
        }
      }
    }
    res.send({ code: 200, data: { menus: menus }, msg: ''})
  })
})

router.post('/searchPerson', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where state = 'unlock' and did != '1' and (username LIKE '%${params.username}%' or name LIKE '%${params.name}%')`
  if (params.did) {
    sql = sql + ` and did = '${params.did}'`
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

router.post('/searchCustomer', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM customer where state = 'unlock' and (ID LIKE '%${params.ID}%' or name LIKE '%${params.name}%')`
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

router.post('/getAccountList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user`
  if (params.uid !== '') {
    sql = sql + ` where uid = '${params.uid}'`
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

module.exports = router