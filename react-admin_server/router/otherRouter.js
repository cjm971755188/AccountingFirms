const express = require('express');
const router = express.Router();
const db = require('../config/db')

router.post('/searchPerson', (req, res) => {
  let params = req.body
  let sql = `SELECT * FROM user where state = 'unlock' and pid != '1' and (username LIKE '%${params.username}%' or name LIKE '%${params.name}%')`
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

module.exports = router