const express = require('express');
const router = express.Router();
const db = require('../config/db')
const moment = require('moment')

router.post('/getAbsentList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM absent where state = 'unlock'`
  if (params.uid !== '') {
    sql = sql + ` and uid = '${params.uid}'`
  }
  if (params.type !== 'all') {
    sql = sql + ` and type = '${params.type}'`
  }
  if (params.progress !== 'all') {
    sql = sql + ` and progress = '${params.progress}'`
  }
  sql = sql + ` ORDER BY aid`
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

router.post('/createAbsent', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM absent WHERE uid = '${params.uid}' and startTime = ${params.startTime} and endTime = ${params.endTime}`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该请假单已存在，不可重复添加！' })
    else {
      const time = (new Date()).valueOf();
      let sql2 = ''
      if (params.flag === 1) {
        sql2 = `INSERT INTO absent VALUES(null, '${params.type}', '${params.uid}', '${params.detail}', ${time}, ${params.startTime}, ${params.endTime}, '已通过', 'unlock', '${params.checkUid}', '${params.checkName}', '${time}', '通过', '', '', '');`
      } else {
        sql2 = `INSERT INTO absent VALUES(null, '${params.type}', '${params.uid}', '${params.detail}', ${time}, ${params.startTime}, ${params.endTime}, '未审批', 'unlock', '', '', '', '', '', '', '');`
      }
      db.query(sql2, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/getDetail', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM absent WHERE aid = '${params.aid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该请假单不存在！' })
    else {
      let sql = `SELECT * FROM user where uid = '${results[0].uid}'`
      let Results = results
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ 
          code: 200, 
          data: {
            basis: {
              '编号': Results[0].aid,
              '员工姓名': results[0].name,
              '请假日期': `${moment(Results[0].startTime).format('YYYY-MM-DD')}至${moment(Results[0].endTime).format('YYYY-MM-DD')}`,
              '请假理由': Results[0].detail,
            },
            timeLine: { 
              name: results[0].name,
              time: moment(Results[0].time).format('YYYY-MM-DD HH:mm:ss'), 
              checkName: Results[0].checkName, 
              checkTime: moment(Results[0].checkTime).format('YYYY-MM-DD HH:mm:ss'), 
              checkResult: Results[0].checkResult,
              invalidName: Results[0].invalidName, 
              invalidTime: moment(Results[0].invalidTime).format('YYYY-MM-DD HH:mm:ss')
            }
          }, 
          msg: '' 
        })
      })
    }
  })
})

router.post('/approval', (req, res) => {
  let params = req.body
  let sql = ''
  const time = (new Date()).valueOf();
  if (params.flag === '审批通过') {
    sql = `UPDATE absent SET progress = '已通过', checkUid = '${params.uid}', checkName = '${params.name}', checkTime = ${time}, checkResult = '通过' WHERE aid = '${params.aid}';`
  } else if (params.flag === '审批不通过') {
    sql = `UPDATE absent SET progress = '未通过', checkUid = '${params.uid}', checkName = '${params.name}', checkTime = ${time}, checkResult = '拒绝' WHERE aid = '${params.aid}';`
  } else if (params.flag === '作废') {
    sql = `UPDATE absent SET progress = '已作废', invalidUid = '${params.uid}', invalidName = '${params.name}', invalidTime = ${time} WHERE aid = '${params.aid}';`
  }
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: {}, msg: '' })
  })
})

router.post('/deleteAbsent', (req, res) => {
  let sql = `SELECT * FROM absent WHERE progress = '已作废' and state = 'unlock'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '已作废的请假单已经清空，请不要重复操作！' })
    else {
      let sql = `UPDATE absent SET state = 'lock' WHERE progress = '已作废'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

module.exports = router