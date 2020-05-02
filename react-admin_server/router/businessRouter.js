const express = require('express');
const router = express.Router();
const db = require('../config/db')
const moment = require('moment');

router.post('/getBusinessList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM business where state = 'unlock'`
  if (params.uid && params.uid !== '' && params.uid !== 1) {
    sql = sql + ` and uid = '${params.uid}'`
  }
  if (params.cid && params.cid !== '') {
    sql = sql + ` and cid = '${params.cid}'`
  }
  if (params.btid && params.btid !== 'all') {
    sql = sql + ` and btid = '${params.btid}'`
  }
  if (params.progress && params.progress !== 'all') {
    sql = sql + ` and progress = '${params.progress}'`
  }
  sql = sql + ` ORDER BY bid`
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
    let sql = `SELECT * FROM businessType`
    db.query(sql, (err, results) => {
      if (err) throw err;
      for (let i = 0; i < _results.length; i++) {
        for (let j = 0; j < results.length; j++) {
          if (_results[i].btid === results[j].btid) {
            _results[i]['btName'] = results[j].name
          }
        }
      }
      let sql = `SELECT * FROM customer`
      db.query(sql, (err, results) => {
        if (err) throw err;
        for (let i = 0; i < _results.length; i++) {
          for (let j = 0; j < results.length; j++) {
            if (_results[i].cid === results[j].cid) {
              _results[i]['ID'] = results[j].ID
              _results[i]['cName'] = results[j].name
              _results[i]['linkName'] = results[j].linkName
              _results[i]['linkPhone'] = results[j].linkPhone
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

router.post('/createBusiness', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM business WHERE bid = '${params.bid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该业务已存在，不可重复添加！' })
    else {
      const time = (new Date()).valueOf();
      sql = `INSERT INTO business VALUES(null, '${params.btid}', '${params.cid}', ${time}, '', '', ${params.salary}, '${params.uid}', '办理中', 'unlock');`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/deleteBusiness', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM business WHERE bid = '${params.bid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该业务不存在，不可删除！' })
    else {
      let sql = `UPDATE business SET state = 'lock' WHERE bid = '${params.bid}';`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/didComplete', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM business WHERE bid = '${params.bid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该业务不存在，不可确认完成！' })
    else {
      const time = (new Date()).valueOf();
      let sql = `UPDATE business SET progress = '未结算', endTime = ${time} WHERE bid = ${params.bid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/didPay', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM business WHERE bid = '${params.bid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该业务不存在，不可结算酬金！' })
    else {
      let time = (new Date()).valueOf();
      let sql = `UPDATE business SET progress = '已完成', payTime = ${time} WHERE bid = ${params.bid};`
      db.query(sql, (err, results) => {
        if (err) throw err;
        let sql = `UPDATE customer SET bPay = bPay + ${params.salary}, payTime = ${time} WHERE cid = ${params.cid};`
        db.query(sql, (err, results) => {
          if (err) throw err;
          let sql = `UPDATE user SET pay = pay + ${params.salary} WHERE uid = ${params.uid};`
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.send({ code: 200, data: {}, msg: '' })
          })
        })
      })
    }
  })
})

router.post('/getAnalysis', (req, res) => {
  let analysis = {
    pCount: { before: 0, now: 0 },
    cCount: { before: 0, now: 0 },
    bCount: { before: 0, now: 0 },
    sCount: { before: 0, now: 0 },
    option: {},
    AList: [],
    BList: [],
    OList: []
  }
  let time = moment(`${(new Date()).getFullYear()}-01-01`).valueOf();
  let sql = `SELECT * FROM user WHERE state = 'unlock' and did != 1`
  db.query(sql, (err, results) => {
    if (err) throw err;
    analysis.pCount.now = results.length
    let sql = `SELECT * FROM user WHERE state = 'unlock' and did != 1 and startTime > ${time}`
    db.query(sql, (err, results) => {
      if (err) throw err;
      analysis.pCount.before = analysis.pCount.now - results.length
      let sql = `SELECT * FROM customer WHERE state = 'unlock'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        analysis.cCount.now = results.length
        let sql = `SELECT * FROM customer WHERE state = 'unlock' and time > ${time}`
        db.query(sql, (err, results) => {
          if (err) throw err;
          analysis.cCount.before = analysis.cCount.now - results.length

          for (let i = 0; i < results.length; i++) {
            analysis.sCount.now = analysis.sCount.now + results[i].bPay + results[i].cPay
          }
          let sql = `SELECT * FROM business WHERE state = 'unlock' and progress = '已完成'`
          db.query(sql, (err, results) => {
            if (err) throw err;
            analysis.bCount.now = results.length
            let sql = `SELECT user.name, COUNT(customer.cid) AS count, customer.cPay
                      FROM user, customer
                      WHERE user.state = 'unlock' 
                      and user.did = 2
                      and customer.state = 'unlock' 
                      and user.uid = customer.uid 
                      GROUP BY user.uid
                      ORDER BY customer.cPay DESC`
            db.query(sql, (err, results) => {
              if (err) throw err;
              analysis.AList = results.slice(0,5)
              let sql = `SELECT user.name, COUNT(business.bid) AS count, user.pay
                        FROM user, business
                        WHERE user.state = 'unlock' 
                        and user.did = 3
                        and business.state = 'unlock' 
                        and user.uid = business.uid 
                        GROUP BY user.uid
                        ORDER BY user.pay DESC`
              db.query(sql, (err, results) => {
                if (err) throw err;
                analysis.BList = results.slice(0,5)
                let sql = `SELECT user.name, SUM(customer.overCount) AS count
                          FROM user, customer
                          WHERE user.state = 'unlock' 
                          and user.did = 2
                          and customer.state = 'unlock' 
                          and user.uid = customer.uid 
                          GROUP BY user.uid
                          ORDER BY SUM(customer.overCount) DESC`
                db.query(sql, (err, results) => {
                  if (err) throw err;
                  analysis.OList = results.slice(0,5)

                  res.send({ code: 200, data: { ...analysis }, msg: '' })
                })
              })
            })
          })
        })
      })
    })
  })
})

router.post('/getBusinessTypes', (req, res) => {
  let sql = `SELECT * FROM businessType`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { businessTypes: results }, msg: '' })
  })
})

router.post('/getUsers', (req, res) => {
  let sql = `SELECT * FROM user`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { users: results }, msg: '' })
  })
})

router.post('/getGuides', (req, res) => {
  let sql = `SELECT * FROM businessType`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) { res.send({ code: 200, data: { guides: [] }, msg: '' }) }
    else {
      let _results = results
      let sql = `SELECT * FROM guide`
      db.query(sql, (err, results) => {
        if (err) throw err;
        for (let i = 0; i < _results.length; i++) {
          _results[i]['steps'] = []
          for (let j = 0; j < results.length; j++) {
            if (_results[i].btid === results[j].btid) {
              _results[i].steps.push(results[j])
            }
          }
          _results[i].steps.sort(compare('step'))
        }
        res.send({ code: 200, data: { guides: _results }, msg: '' })
      })
    }
  })
})

function compare(property){
  return function(a,b){
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
  }
}

module.exports = router