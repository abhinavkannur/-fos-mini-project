// const Cart=require('../models/cartmodel');
// const jwt=require('jsonwebtoken');

// const renderCheckout=async(req,res)=>{
//   const token=req.cookies.token;
//   if(!token){
//     return res.redirect('/login');
//   }
//   try{
//     const decoded=jwt.verify(token,process.env.JWT_SECRET);
//     const userId=decoded.userId;
//     //fetch users cart product details
//     const cart =await Cart.findOne({user:userId}).populate('items.product');
//     if(!cart||cart.items.length==0){
//       return res.redirect('/cart1');
//     }
//     //calculate total amount
//     const totalAmount=cart.items.reduce((acc,item)=>acc + item.product.price * item.quantity, 0);
//   //render checkoutpage

//   res.render('users/checkout',{cart,totalAmount});
//   }catch(error){
//     console.error(error)
//     res.status(500).send('server error');
//   }
// }

// module.exports={renderCheckout}