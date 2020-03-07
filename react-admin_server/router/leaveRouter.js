const express = require('express');
const router = express.Router();
const db = require('../config/db')
const moment = require('moment')

router.post('/getLeaveList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM absent where state = 'unlock' and name LIKE '%${params.name}%'`
  if (params.type !== 'all') {
    sql = sql + ` and type = '${params.type}'`
  }
  if (params.progress !== 'all') {
    sql = sql + ` and progress = '${params.progress}'`
  }
  sql = sql + ` ORDER BY lid`
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

router.post('/createLeave', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM absent WHERE uid = '${params.uid}' and startTime = ${params.startTime} and endTime = ${params.endTime}`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该请假单已存在，不可重复添加！' })
    else {
      const time = (new Date()).valueOf();
      let sql = ''
      if (params.flag === 1) {
        sql = `INSERT INTO absent VALUES(null, '${params.type}', '${params.uid}', '${params.name}', '${params.detail}', ${time}, ${params.startTime}, ${params.endTime}, '已通过', 'unlock', '${params.checkUid}', '${params.checkName}', '${time}', '通过', '', '', '');`
      } else {
        sql = `INSERT INTO absent VALUES(null, '${params.type}', '${params.uid}', '${params.name}', '${params.detail}', ${time}, ${params.startTime}, ${params.endTime}, '未审批', 'unlock', '', '', '', '', '', '', '');`
      }
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/getDetail', (req, res) => {
  let params = req.body
  let s = `SELECT * FROM absent WHERE lid = '${params.lid}'`
  db.query(s, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该请假单不存在！' })
    else {
      res.send({ 
        code: 200, 
        data: {
          basis: {
            '编号': results[0].lid,
            '员工姓名': results[0].name,
            '请假日期': `${moment(results[0].startTime).format('YYYY-MM-DD')}至${moment(results[0].endTime).format('YYYY-MM-DD')}`,
            '请假理由': results[0].detail,
          },
          timeLine: { 
            name: results[0].name,
            time: moment(results[0].time).format('YYYY-MM-DD HH:mm:ss'), 
            checkName: results[0].checkName, 
            checkTime: moment(results[0].checkTime).format('YYYY-MM-DD HH:mm:ss'), 
            checkResult: results[0].checkResult,
            invalidName: results[0].invalidName, 
            invalidTime: moment(results[0].invalidTime).format('YYYY-MM-DD HH:mm:ss')
          }
        }, 
        msg: '' 
      })
    }
  })
})

router.post('/approval', (req, res) => {
  let params = req.body
  let sql = ''
  const time = (new Date()).valueOf();
  if (params.flag === '审批通过') {
    sql = `UPDATE absent SET progress = '已通过', checkUid = '${params.uid}', checkName = '${params.name}', checkTime = ${time}, checkResult = '通过' WHERE lid = '${params.lid}';`
  } else if (params.flag === '审批不通过') {
    sql = `UPDATE absent SET progress = '未通过', checkUid = '${params.uid}', checkName = '${params.name}', checkTime = ${time}, checkResult = '拒绝' WHERE lid = '${params.lid}';`
  } else if (params.flag === '作废') {
    sql = `UPDATE absent SET progress = '已作废', invalidUid = '${params.uid}', invalidName = '${params.name}', invalidTime = ${time} WHERE lid = '${params.lid}';`
  }
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: {}, msg: '' })
  })
})

router.post('/deleteLeave', (req, res) => {
  let s = `SELECT * FROM absent WHERE progress = '已作废' and state = 'unlock'`
  db.query(s, (err, results) => {
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