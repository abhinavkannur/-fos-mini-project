require('dotenv').config();
const express=require('express')
const path=require('path');
const app=express();
const bodyparser=require('body-parser');

//import routes
const homeroutes=require('./routes/homeroute');
const { default: mongoose } = require('mongoose');
// db connection
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log('Mongodb connected'))
.catch(err=>console.error('Mongodb connection error:',err))


//template engine setup
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//middlewatre to parse incoming request boides
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//server static files
app.use(express.static(path.join(__dirname,'public')));

// using routes
app.use('/',homeroutes)


//start server
const PORT=process.env.PORT||3000
app.listen(PORT,()=>{
  console.log('server started');
})