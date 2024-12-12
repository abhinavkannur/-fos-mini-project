const express=require('express')
const path=require('path');
const app=express();
//import routes
const homeroutes=require('./routes/homeroute');

//template engine setup
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//server static files
app.use(express.static(path.join(__dirname,'public')));

//routes
app.use('/',homeroutes)




app.listen(4000,()=>{
  console.log('server started');
})