var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//引入mongoose套件
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/test",{useNewUrlParser:true});
//透過 mongoose 的 connection() 方法找到連線的資料庫
var db=mongoose.connection;
//on()檢測目前資料庫的狀態，後方()內程式代表當發生error 時會觸發console.error藉此印出錯誤內容
db.on("error",console.error.bind(console,"connection error"));
//一旦檢測到資料庫的狀況為 'open'，函數就會執行
db.once("open",function(){
  console.log("connected!");
});
//定義欄位架構schema
var testSchema = new mongoose.Schema({
  id:Number,
  name:String
});
//Schema 的配置,set(配置選項，選項的值)
testSchema.set("collection","first_collection");
//model(名稱，架構)
var testModel=mongoose.model("first_collection",testSchema);

//新增
var content = new testModel({id:3,name:"User3"});
//用save()存進資料庫
// content.save(function(err){
//   if(err){
//     console.log(err); //儲存失敗
//   }else{
//     console.log("Insert success!"); //儲存成功
//   }
// });

//查詢
testModel.find(function(err,data){
  if(err){
    console.log(err);
  }else{
    console.log(data); //輸出結果
  }
});

//修改
//update(修改條件，修改對象&值)
testModel.update({id:1},{name:"www"},function(err){
  if(err){
    console.log(err);
  }else{
    console.log("update success!");
  }
});

//刪除
testModel.remove({id:2},function(err){
  if(err){
    console.log(err);
  }else{
    console.log("delete success!");
  }
});




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
