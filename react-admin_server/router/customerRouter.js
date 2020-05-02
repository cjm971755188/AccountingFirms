const express = require('express');
const router = express.Router();
const db = require('../config/db')
const moment = require('moment');

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
    if (params.credit === '欠款') {
      sql = sql + ` and debt > 0`
    } else {
      sql = sql + ` and debt = 0`
    }
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
      let sql = `INSERT INTO customer VALUES(null, '${params.ID}', '${params.name}', ${time}, '${params.ctid}', '${params.sid}', '${params.linkName}', '${params.linkPhone}', '${params.uid}', 0, 0, '未完成', 0, 'unlock');`
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
      let sql = `INSERT INTO income VALUES(null, 'pay', 'business', ${params.cid}, ${params.uid}, ${params.pay}, ${time})`
      db.query(sql, (err, results) => {
        if (err) throw err;
        let sql = `UPDATE customer SET debt = debt - ${params.pay} WHERE cid = ${params.cid};`
        db.query(sql, (err, results) => {
          if (err) throw err;
          res.send({ code: 200, data: {}, msg: '' })
        })
      })
    }
  })
})

router.post('/getAnalysis', (req, res) => {
  let analysis = {
    count: { before: 0, now: 0 },
    salary: { before: 0, now: 0 },
    CList: [],
    UList: [],
    OList: [],
    option: {},
  }
  let time = moment(`${(new Date()).getFullYear()}-01-01`).valueOf();
  let sql = `SELECT * FROM customer WHERE state = 'unlock'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    analysis.count.now = results.length
    let sql = `SELECT * FROM customer WHERE state = 'unlock' and time > ${time}`
    db.query(sql, (err, results) => {
      if (err) throw err;
      analysis.count.before = analysis.count.now - results.length
      let sql = `SELECT SUM(money) AS salary FROM income WHERE type = 'salary' and bType = 'business' and time > ${time}`
      db.query(sql, (err, results) => {
        if (err) throw err;
        analysis.salary.now = results[0].salary
        let time2 = moment(`${(new Date()).getFullYear() - 1}-01-01`).valueOf();
        let sql = `SELECT SUM(money) AS salary FROM income WHERE type = 'salary' and bType = 'business' and time > ${time2} and time < ${time}`
        db.query(sql, (err, results) => {
          if (err) throw err;
          analysis.salary.before = results[0].salary
          let sql = `SELECT customer.name, SUM(income.money) AS pay
                    FROM customer, income
                    WHERE customer.state = 'unlock' 
                    and customer.cid = income.cid
                    and income.type = 'pay'
                    and income.bType = 'business'
                    GROUP BY customer.cid
                    ORDER BY SUM(income.money) DESC`
          db.query(sql, (err, results) => {
            if (err) throw err;
            analysis.CList = results.slice(0,5)
            let sql = `SELECT user.name, SUM(income.money) AS pay
                      FROM user, income
                      WHERE user.state = 'unlock' 
                      and user.did = 2
                      and user.uid = income.uid 
                      and income.type = 'pay'
                      and income.bType = 'business'
                      GROUP BY user.uid
                      ORDER BY SUM(income.money) DESC`
            db.query(sql, (err, results) => {
              if (err) throw err;
              for (let i = 0; i < results.length; i++) {
                if (results[i].cPay !== 0) {
                  analysis.UList.push(results[i])
                }
              }
              analysis.UList = analysis.UList.slice(0,5)
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
                for (let i = 0; i < results.length; i++) {
                  if (results[i].count !== 0) {
                    analysis.OList.push(results[i])
                  }
                }
                analysis.OList = analysis.OList.slice(0,7)

                let sql1 = `SELECT * FROM income WHERE time > ${time} and type = 'pay'`
                db.query(sql1, (err, results) => {
                  if (err) throw err;
                  let data1 = [0,0,0,0,0,0,0,0,0,0,0,0]
                  for (let i = 0; i < results.length; i++) {
                    for (let j = 0; j < data1.length; j++) {
                      if ((new Date(results[i].time)).getMonth() === j) {
                        data1[j] = data1[j] + results[i].money
                      }
                    }
                  }
                  let sql2 = `SELECT * FROM income WHERE time > ${time2} and time < ${time} and type = 'pay'`
                  db.query(sql2, (err, results) => {
                    if (err) throw err;
                    let data2 = [0,0,0,0,0,0,0,0,0,0,0,0]
                    for (let i = 0; i < results.length; i++) {
                      for (let j = 0; j < data2.length; j++) {
                        if ((new Date(results[i].time)).getMonth() === j) {
                          data2[j] = data2[j] + results[i].money
                        }
                      }
                    }

                    analysis.option = {
                      title: {
                        text: `${(new Date()).getFullYear() - 1}-${(new Date()).getFullYear()}两年客户做账实获收益对比图`
                      },
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'cross',
                          label: {
                            backgroundColor: '#6a7985'
                          }
                        }
                      },
                      legend: {
                        data: [`${(new Date()).getFullYear() - 1}`, `${(new Date()).getFullYear()}`]
                      },
                      toolbox: {
                        feature: {
                          saveAsImage: {}
                        }
                      },
                      grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                      },
                      xAxis: [
                        {
                          type: 'category',
                          boundaryGap: false,
                          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                        }
                      ],
                      yAxis: [
                        {
                          type: 'value'
                        }
                      ],
                      series: [
                        {
                          name: `${(new Date()).getFullYear() - 1}`,
                          type: 'line',
                          stack: '总量',
                          areaStyle: {},
                          data: data2
                        },
                        {
                          name: `${(new Date()).getFullYear()}`,
                          type: 'line',
                          stack: '总量',
                          label: {
                            normal: {
                              show: true,
                              position: 'top'
                            }
                          },
                          areaStyle: {},
                          data: data1
                        }
                      ]
                    };
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