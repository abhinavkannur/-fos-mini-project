const Order=require('../models/order');

const paymentsucess=async(req,res)=>{
  try{
    const token=req.cookies.token;
    if(!token)
    {

      return res.redirect('/login')
    } 
    res.render('users/paymentsucess');
  }catch(error){
    console.log(error);
    res.status(404).send('internal server error');
  }
}

cancelpayment=async(req,res)=>{
  try{
    const token=req.cookies.token;
    if(!token)
    {

      return res.redirect('/login')
    } 
    res.render('users/paymentcancel');
  }catch(error){
    console.log(error);
    res.status(404).send('internal server error');
  }
  
  
  
}


module.exports={paymentsucess,cancelpayment}