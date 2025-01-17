const Cart=require('../models/cartmodel');
const jwt=require('jsonwebtoken');
const Order=require('../models/order');


const renderCheckout=async(req,res)=>{
  const token=req.cookies.token;
  if(!token){
    return res.redirect('/login');
  }
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const userId=decoded.userId;
    //fetch users cart product details
    const cart =await Cart.findOne({user:userId}).populate('items.product');
    if(!cart||cart.items.length==0){
      return res.redirect('/cart1');
    }
    //calculate total amount
    const totalAmount=cart.items.reduce((acc,item)=>acc + item.product.price * item.quantity, 0);
  //render checkoutpage

  res.render('users/checkout',{cart,totalAmount});
  }catch(error){
    console.error(error)
    res.status(500).send('server error');
  }
}


const handllecheckout = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.redirect('/cart');
    }

    const { name, address, city, paymentMethod, couponCode } = req.body;

    // Validate required fields
    if (!name || !address || !city || !paymentMethod) {
      return res.status(400).send('All fields are required');
    }

    // Calculate the total amount
    let totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // Check if a coupon is applied
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(400).send('Invalid coupon');
      }
      if (new Date(coupon.expireDate) < new Date()) {
        return res.status(400).send('Coupon has expired');
      }
      if (coupon.usageLimit <= coupon.usedBy.length) {
        return res.status(400).send('Coupon usage limit reached');
      }

      // Calculate the discount
      discountAmount = (totalAmount * coupon.discount) / 100;
      totalAmount -= discountAmount;

      // Mark the coupon as used by this user
      if (!coupon.usedBy.includes(userId)) {
        coupon.usedBy.push(userId);
        await coupon.save();
      }
    }

    // Redirect based on payment method
    if (paymentMethod === 'COD') {
      return res.render('users/cashondelivery', { totalAmount, discountAmount });
    } else if (paymentMethod === 'Credit Card') {
      return res.render('users/stripepayment', { totalAmount, discountAmount });
    } else {
      return res.status(400).send('Invalid payment method');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};




module.exports={renderCheckout,handllecheckout}