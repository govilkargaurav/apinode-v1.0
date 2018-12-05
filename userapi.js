const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const json = require('json')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbo = '';

const port  = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "nodeJsDB",
  insecureAuth: true
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("userDatabase");
}); 


app.get('/create', (req, res) => {

  let sqlQuery = "CREATE DATABASE nodeJsDB"
  con.query(sqlQuery, function (err, result) {
    if (err) {
      throw err
    }
    console.log("Result: " + result);
    res.send('Database Created');
  });
});

app.post('/signup', (req, res) => {

  let post = { name_user: req.body.name, age_user: req.body.age, email_user: req.body.email, sysid_user: req.body.name + req.body.email };
  let sql = "INSERT INTO tbl_user SET ?";
  let query = con.query(sql, post, (err, result) => {
    if (err) {
      throw err
    }else{
      console.log(post)
      dbo.collection("Product").insertOne(post, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
      });
      res.json(result);
    }
  });
});

app.get('/allusers', function (req, res) {
  var data = {
    "epoch": "12345",
    "isLocal": "true",
    "spam": "1",
    "users": ""
  };

  // query = {"idtbl_user":1}
  // projection = {"_id":0, "name_user":1}
  dbo.collection("Product").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    
    data["users"] = result;
    data = result
    res.json(data);
  });

});

con.on('error', function (err) {
  console.log("[mysql error]", err);
});
app.listen(port, () => {
  console.log(`app is listing at ${port}`);
});