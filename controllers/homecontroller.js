const renderhomepage=(req,res)=>
{
  res.render('index_2')
}

const renderabout=(req,res)=>{
  res.render('about')
}
const rendercontact=(req,res)=>{
  res.render('contact')
}
const rendermenu=(req,res)=>{
  res.render('shop');
}
const rendercart=(req,res)=>{
  res.render('cart');
}
const rendercheckout=(req,res)=>{
  res.render('checkout');
}
const rendersingleproduct=(req,res)=>{
  res.render('single-product');
}
const render404=(req,res)=>{
  res.render('404');
}
module.exports={renderhomepage,renderabout,rendercontact,rendermenu,rendercart,rendercheckout,rendersingleproduct,render404};