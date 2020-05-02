const express = require('express');
var schedule = require("node-schedule");  
const app = express();

// 监听端口
app.listen('3000', () => {
  console.log('Server started')
})

// 创建连接, 连接数据库
const db = require('./config/db')
db.connect((err) => {
  if (err) throw err;
  function scheduleCronstyle1(){
    schedule.scheduleJob('0 0 0 * * *', function(){
      console.log('scheduleCronstyle1:' + new Date());
      let sql = `SELECT * FROM user where state = 'unlock' ORDER BY uid`
      db.query(sql, (err, results) => {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
          let uid = results[i].uid
          let sql = `SELECT * FROM absent where progress = '已通过' and uid = '${results[i].uid}'`
          db.query(sql, (err, results) => {
            if (err) throw err;
            if (results.length === 0) {
              let sql = `UPDATE user SET absent = '在班' where uid = '${uid}'`
              db.query(sql, (err, r) => { if (err) throw err })
            } else {
              let x = 0
              for (let j = 0; j < results.length; j++) {
                let today = (new Date()).valueOf();
                if (today > results[j].startTime && today < results[j].endTime) {
                  x ++;
                  let sql = `UPDATE user SET absent = '请假' where uid = '${uid}'`
                  db.query(sql, (err, r) => { if (err) throw err; })
                }
              }
              if (x === 0) {
                let sql = `UPDATE user SET absent = '在班' where uid = '${uid}'`
                db.query(sql, (err, r) => { if (err) throw err })
              }
            }
          })
        }
      })
    }); 
  }
  function scheduleCronstyle2(){
    schedule.scheduleJob('0 0 0 1 * *', function(){
      console.log('scheduleCronstyle2:' + new Date());
      let sql2 = `SELECT * FROM customer where state = 'unlock' ORDER BY cid`
      db.query(sql2, (err, results) => {
        if (err) throw err;
        let Results = results[i], nowYear = (new Date()).getFullYear(), nowMonth = (new Date()).getMonth() + 1
        if ((new Date(Results.didTime)).getFullYear() === nowYear && nowMonth - (new Date(Results.didTime)).getMonth() + 1 > 0) {
          let sql1 = `UPDATE customer SET progress = '已超时', overCount = overCount + 1 where progress = '未完成'`
          db.query(sql1, (err, r) => { 
            if (err) throw err;
            let sql1 = `UPDATE customer SET progress = '未完成' where progress = '已完成'`
            db.query(sql1, (err, r) => { if (err) throw err })
          })
        }
        for (let i = 0; i < results.length; i++) {
          let sql = `SELECT * FROM customerType where ctid = '${Results.ctid}'`
          db.query(sql, (err, results) => {
            if (err) throw err;
            let count = results[0].count
            let sql = `SELECT * FROM salary where sid = '${Results.sid}'`
            db.query(sql, (err, results) => {
              if (err) throw err;
              let salary = results[0].salary
              let payYear = (new Date(Results.payTime)).getFullYear()
              let payMonth = (new Date(Results.payTime)).getMonth() + 1
              let debt = 0
              if (nowYear - payYear === 0) {
                debt = Math.floor((nowMonth - payMonth)/count)*salary
              } else {
                debt = Math.floor((nowMonth - payMonth + 12*(nowYear - payYear))/count)*salary
              }
              if (debt !== 0) {
                let sql = `UPDATE customer SET debt = debt + ${debt}, debtCount = debtCount + 1 where cid = '${Results.cid}'`
                db.query(sql, (err, r) => { if (err) throw err })
              }
            })
          })
        }
      })
    }); 
  }
  function scheduleCronstyle3(){
    schedule.scheduleJob('0 0 0 1 1 *', function(){
      console.log('scheduleCronstyle3:' + new Date());
      let sql1 = `UPDATE customer SET overCount = 0, debtCount = 0`
      db.query(sql1, (err, r) => { if (err) throw err })
    }); 
  }
  scheduleCronstyle1();
  scheduleCronstyle2();
  scheduleCronstyle3();
  console.log('Mysql connected')
})

// body-parser解析json
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

// 跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
      //这段仅仅为了方便返回json而已
  res.header("Content-Type", "application/json;charset=utf-8");
  if(req.method == 'OPTIONS') {
      //让options请求快速返回
      res.sendStatus(200); 
  } else { 
      next(); 
  }
});

// 引入路由
const userRouter = require('./router/userRouter')
const personRouter = require('./router/personRouter')
const absentRouter = require('./router/absentRouter')
const customerRouter = require('./router/customerRouter')
const businessRouter = require('./router/businessRouter')
const departmentRouter = require('./router/departmentRouter')
const customerTypeRouter = require('./router/customerTypeRouter')
const businessTypeRouter = require('./router/businessTypeRouter')
const accountRouter = require('./router/accountRouter')
app.use('/user', userRouter)
app.use('/person', personRouter)
app.use('/absent', absentRouter)
app.use('/customer', customerRouter)
app.use('/business', businessRouter)
app.use('/department', departmentRouter)
app.use('/customerType', customerTypeRouter)
app.use('/businessType', businessTypeRouter)
app.use('/account', accountRouter)