
// const { use } = require('../routes/homeroute')









const renderabout=(req,res)=>{
  res.render('users/about')
}
const rendercontact=(req,res)=>{
  res.render('users/contact')
}
const rendermenu=(req,res)=>{
  res.render('users/shop1');
}
const rendercart=(req,res)=>{
  res.render('users/cart');
}
// const rendercheckout=(req,res)=>{
//   res.render('users/checkout');
// }
const rendersingleproduct=(req,res)=>{
  res.render('users/single-product');
}
const render404=(req,res)=>{
  res.render('users/404');
}



module.exports={renderabout,rendercontact,rendermenu,rendercart,rendersingleproduct,render404};