const express = require('express');
const app = express();

// 监听端口
app.listen('3000', () => {
  console.log('Server started')
})

// 创建连接, 连接数据库
const db = require('./config/db')
db.connect((err) => {
  if (err) throw err;
  console.log('Mysql connected')
  let sql = `SELECT * FROM user where state = 'unlock' and did != '1'`
  sql = sql + ` ORDER BY uid`
  db.query(sql, (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      let s = `SELECT * FROM absent where state = '已通过' and uid = '${results[i].uid}'`
      db.query(s, (err, result) => {
        if (err) throw err;
        if (result.length === 0 && results[i].abent !== '在班') {
          let q = `UPDATE user SET absent = '在班' where uid = '${results[i].uid}'`
          db.query(q, (err, r) => { if (err) throw err })
        } else if (result.length !== 0 && results[i].abent !== '请假') {
          for (let j = 0; j < result.length; j++) {
            const today = (new Date()).valueOf();
            if (today > result[j].startTime && today < result[j].endTime) {
              let q = `UPDATE user SET absent = '请假' where uid = '${results[i].uid}'`
              db.query(q, (err, r) => { if (err) throw err })
            }
          }
        }
      })
    }
    console.log('当天请假情况已更新')
  })
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