const jwt=require('jsonwebtoken');
const Cart=require('../models/cart');
const Product=require('../models/product');
const router = require('../routes/homeroute');


//add to cart 

const addToCart=async(req,res)=>{
  try{
    const {productId}=req.body;
    const token=req.cookies.token;

    if(!token){
      return res.redirect('/login');
    }
    //verify the token
    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    const userId=decoded.userId;

    const product=await Product.findById(productId);
    if(!product){
      return res.status(404).send('product not found');

    }

    //find the users cart or create an new one if cart does not exists
    let cart=await Cart.findOne({userId});
    if(!cart){
      cart=new Cart({userId,items:[],totalPrice:0});

    }

    //check if the product is alreday inthe cart
    const productIndex=cart.items.findIndex(item=>{item.productId.toString()===productId});

  if(productIndex!==-1){
    //if product alreday exist in cart increase quantity
    cart.items[productIndex].quantity+=1;

  }else{
    //otherwise ,add the product to the cart
    cart.items.push({productId,quantity:1});

  }

  //recalculate  the total price
  let totalPrice = 0; for (const item of cart.items) { const product = await Product.findById(item.productId); totalPrice += product.price * item.quantity; } cart.totalPrice = totalPrice;
   await cart.save();

   res.redirect('/menu')


  }catch(error){
    console.error(error);
    res.status(400).send('internal server error')
  }
}
const viewcart = async (req, res) => {
  try {
    const userId='dummyUserId';
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.render('cart', { cart: [], cartTotal: 0 });
    }
    const cartTotal = cart.totalPrice;
    res.render('cart', { cart: cart.items, cartTotal });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};




module.exports={addToCart,viewcart};


