const express = require('express');
const router = express.Router();
const db = require('../config/db')
const moment = require('moment');

router.post('/getPersonList', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where state = 'unlock' and did != '0' and did != '1'`
  if (params.username !== '') {
    sql = sql + ` and username LIKE '%${params.username}%'`
  }
  if (params.name !== '') {
    sql = sql + ` and name LIKE '%${params.name}%'`
  }
  if (params.did !== 'all') {
    sql = sql + ` and did = '${params.did}'`
  }
  if (params.absent !== 'all') {
    sql = sql + ` and absent = '${params.absent}'`
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

router.post('/createPerson', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE phone = '${params.phone}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length !== 0) res.send({ code: 200, data: {}, msg: '该员工账号（手机号）已存在，不可重复添加！' })
    else {
      let sql = `SELECT username FROM user ORDER BY uid DESC limit 1`
      db.query(sql, (err, results) => {
        if (err) throw err;
        let id = Number(results[0].username.slice(3,8)) + 1
        let sql = `SELECT * FROM department where did = '${params.did}'`
        db.query(sql, (err, results) => {
          const username = 'JMG' + (id/Math.pow(10,5)).toFixed(5).substr(2)
          const startTime = (new Date()).valueOf();
          let sql = `INSERT INTO user VALUES(null, '${username}', '123456', '${params.name}', '${params.sex}', '${params.phone}', '${startTime}', '${params.did}', '默认', '${results[0].permission}', '在班', 'unlock');`
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.send({ code: 200, data: { username }, msg: '' })
          })
        })
      })
    }
  })
})

router.post('/editPerson', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可修改信息！' })
    else {
      let sql = '', data = {}
      if (params.password) {
        sql = `UPDATE user SET password = '${params.password}' WHERE uid = ${params.uid};`
      } else if (!params.did) {
        sql = `UPDATE user SET name = '${params.name}', sex = '${params.sex}', phone = '${params.phone}' WHERE uid = ${params.uid};`
        data = {
          "uid": results[0].uid,
          "username": results[0].username,
          "name": params.name,
          "sex": params.sex,
          "phone": params.phone,
          "permission": results[0].permission,
          "absent": results[0].absent,
          "state": results[0].state,
          "change": results[0].password === 123456 ? 1 : 0
        }
      } else {
        sql = `UPDATE user SET name = '${params.name}', sex = '${params.sex}', phone = '${params.phone}', did = '${params.did}', permission = '${params.permission}' WHERE uid = ${params.uid};`
      }
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data, msg: '' })
      })
    }
  })
})

router.post('/deletePerson', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可删除！' })
    else {
      let sql = `UPDATE user SET state = 'lock' WHERE uid = '${params.uid}';`
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.send({ code: 200, data: {}, msg: '' })
      })
    }
  })
})

router.post('/getDetail', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user WHERE uid = '${params.uid}'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length === 0) res.send({ code: 200, data: {}, msg: '该员工账号不存在，不可删除！' })
    else {
      let detail = {
        basis: {
          "工号": results[0].username,
          "入职时间": moment(results[0].startTime).format('YYYY-MM-DD'),
          "入职时长": getLength(moment(results[0].startTime).format('YYYY-MM-DD'), moment((new Date()).valueOf()).format('YYYY-MM-DD')),
          "姓名": results[0].name,
          "性别": results[0].sex,
          "联系电话": results[0].phone,
          "部门职位": '注册部',
          "权限类型": results[0].pType,
          "账号状态": results[0].state === 'unlock' ? '正常' : '已锁定'
        },
        analysis: {
          option: {},
          bOption: {},
          btOption: {},
          attendance: {},
          sum: 0
        }
      }
      let sql = `SELECT * FROM absent where progress = '已通过' and uid = '${params.uid}'`
      db.query(sql, (err, results) => {
        if (err) throw err;
        let count = 0, today = (new Date()).valueOf();
        for (let i = 0; i < results.length; i++) {
          if (results[i].startTime < today) {
            if (results[i].endTime <= today) {
              count = count + (results[i].endTime - results[i].startTime)/(24*60*60*1000)
            } else {
              count = count + (today - results[i].startTime)/(24*60*60*1000)
            }
          }
        }
        const all = (new Date).getDate()
        const attendance = (all-count)/all
        if (attendance >= 0.95) {
          detail.analysis.attendance = { count: attendance, color: '#43CD80' }
        } else {
          detail.analysis.attendance = { count: attendance, color: '#CD3333' }
        }
        // analysis
        if (params.did === 3) {
          let sql = `SELECT * FROM businessType`
          db.query(sql, (err, results) => {
            if (err) throw err;
            let indicator = [], seriesData = [{ name: '办理中', value: []}, { name: '未结算', value: []}, { name: '已完成', value: []}]
            for (let i = 0; i < results.length; i++) {
              indicator.push({ name: results[i].name, max: 0 })
              seriesData[0].value.push(0)
              seriesData[1].value.push(0)
              seriesData[2].value.push(0)
            }
            let btTypes = results
            let sql = `SELECT * FROM business where uid = '${params.uid}'`
            let ing = 0, not = 0, done = 0
            let month = (new Date()).getMonth() + 1
            db.query(sql, (err, results) => {
              if (err) throw err;
              for (let i = 0; i < results.length; i++) {
                if (results[i].progress === '办理中') {
                  if (Number(moment(results[i].startTime).format('MM')) === month) {
                    ing = ing + 1
                  }
                  for (let j = 0; j < btTypes.length; j++) {
                    if (results[i].btid === btTypes[j].btid) {
                      seriesData[0].value[btTypes[j].btid - 1] = seriesData[0].value[btTypes[j].btid - 1] + 1
                    }
                  }
                } else if (results[i].progress === '未结算') {
                  if (Number(moment(results[i].startTime).format('MM')) === month) {
                    not = not + 1
                  }
                  for (let j = 0; j < btTypes.length; j++) {
                    if (results[i].btid === btTypes[j].btid) {
                      seriesData[1].value[btTypes[j].btid - 1] = seriesData[1].value[btTypes[j].btid - 1] + 1
                    }
                  }
                } else if (results[i].progress === '已完成') {
                  if (Number(moment(results[i].startTime).format('MM')) === month) {
                    done = done + 1
                  }
                  for (let j = 0; j < btTypes.length; j++) {
                    if (results[i].btid === btTypes[j].btid) {
                      seriesData[2].value[btTypes[j].btid - 1] = seriesData[2].value[btTypes[j].btid - 1] + 1
                    }
                  }
                }
              }
              detail.analysis.bOption = { 
                title: {
                  text: '本月业务进度量',
                  left: 'center'
                },
                toolbox: {
                  show: true,
                  feature: {
                    dataZoom: {
                      yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                  }
                },
                xAxis: {
                  type: 'category',
                  data: ['办理中', '未结算', '已完成']
                },
                yAxis: {
                  type: 'value',
                  minInterval: 1
                },
                series: [{
                  data: [ing, not, done],
                  type: 'bar',
                  barWidth: 40
                }],
              }
              for (let i = 0; i < indicator.length; i++) {
                indicator[i].max = results.length
              }
              detail.analysis.btOption = {
                title: {
                  text: '业务类型能力雷达图'
                },
                tooltip: {},
                toolbox: {
                  show: true,
                  feature: {
                    dataZoom: {
                      yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                  }
                },
                legend: {
                  data: ['办理中', '未结算', '已完成']
                },
                radar: {
                  name: {
                    textStyle: {
                      color: '#fff',
                      backgroundColor: '#999',
                      borderRadius: 3,
                      padding: [3, 5]
                    }
                  },
                  indicator: indicator
                },
                series: [{
                  name: '办理中 vs 未结算 vs 已完成',
                  type: 'radar',
                  data: seriesData
                }]
              };
              detail.analysis.sum = results.length
              res.send({ code: 200, data: { ...detail }, msg: '' })
            })
          })
        } else {
          let sql = `SELECT * FROM salary`
          db.query(sql, (err, results) => {
            if (err) throw err;
            let Results = results, temp = [], xAxisData = [], seriesData = []
            let sql = `SELECT * FROM customerType`
            db.query(sql, (err, results) => {
              if (err) throw err;
              for (let i = 0; i < results.length; i++) {
                for (let j = 0; j < Results.length; j++) {
                  if (Results[j].ctid === results[i].ctid) {
                    xAxisData.push(`${results[i].name}-${Results[j].salary}`)
                    seriesData.push(0)
                    temp.push(Results[j].sid)
                  }
                }
              }
              let sql = `SELECT * FROM customer where uid = '${params.uid}'`
              db.query(sql, (err, results) => {
                if (err) throw err;
                for (let i = 0; i < results.length; i++) {
                  for (let j = 0; j < temp.length; j++) {
                    if (results[i].sid === temp[j]) {
                      seriesData[j] ++
                    }
                  }
                }
                detail.analysis.option = {
                  title: {
                    text: '负责的客户结算类型统计图',
                    left: 'center'
                  },
                  toolbox: {
                    show: true,
                    feature: {
                      dataZoom: {
                        yAxisIndex: 'none'
                      },
                      restore: {},
                      saveAsImage: {}
                    }
                  },
                  xAxis: {
                    type: 'category',
                    data: xAxisData
                  },
                  yAxis: {
                    type: 'value',
                    minInterval: 1
                  },
                  series: [{
                    data: seriesData,
                    type: 'bar',
                    barWidth: 40
                  }]
                }
                detail.analysis.sum = results.length
                res.send({ code: 200, data: { ...detail }, msg: '' })
              })
            })
          })
        }
      })
    }
  })
})

router.post('/getDepartments', (req, res) => {
  let sql = `SELECT * FROM department where did != '0' and did != '1'`
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send({ code: 200, data: { departments: results }, msg: '' })
  })
})

function getLength(startTime, today){
  const date1 = startTime.split("-")
  const date2 = today.split("-")
  let length = ''
  let year1 = Number(date1[0])
  let year2 = Number(date2[0])
  let month1 = Number(date1[1])
  let month2 = Number(date2[1])
  let day1 = Number(date1[2])
  let day2 = Number(date2[2])
  if (year2 > year1) { 
    length = `${year2 - year1}` + '年'
  }
  if (month2 > month1) {
    length = length + `${month2 - month1}` + '月'
  }
  if (day2 > day1) {
    length = length + `${day2 - day1}` + '日'
  }
  return length
}

module.exports = router