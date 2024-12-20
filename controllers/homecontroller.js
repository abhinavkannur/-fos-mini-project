
// const { use } = require('../routes/homeroute')


const renderhomepage=(req,res)=>
{
  res.render('users/index_2')
}

const renderabout=(req,res)=>{
  res.render('users/about')
}
const rendercontact=(req,res)=>{
  res.render('users/contact')
}
const rendermenu=(req,res)=>{
  res.render('users/shop');
}
const rendercart=(req,res)=>{
  res.render('users/cart');
}
const rendercheckout=(req,res)=>{
  res.render('users/checkout');
}
const rendersingleproduct=(req,res)=>{
  res.render('users/single-product');
}
const render404=(req,res)=>{
  res.render('users/404');
}



module.exports={renderhomepage,renderabout,rendercontact,rendermenu,rendercart,rendercheckout,rendersingleproduct,render404};