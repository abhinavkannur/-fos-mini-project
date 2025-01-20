const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const Cart = require('../models/cartmodel');
const User=require('../models/user');
const Coupon=require('../models/coupnmodel');

const renderCheckout = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user's cart product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length == 0) {
      return res.redirect('/cart1');
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    // Render checkout page
    res.render('users/checkout', { cart, totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

const checkoutController = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user's cart product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.redirect('/cart1');
    }

    let totalAmount = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    let discountAmount = 0;
    

    // Check payment method and handle accordingly
    const paymentMethod = req.body.paymentMethod;
    if (paymentMethod === 'COD') {
      // Handle Cash on Delivery (COD) logic
      const order = new Order({
        user: userId,
        name:req.body.name,
        items: cart.items,
        totalAmount: totalAmount - discountAmount, // Subtract any discounts
        address: req.body.address,
        city: req.body.city,
        phone: req.body.phone,
        paymentMethod: 'COD', // Cash on delivery
        status: 'Pending', // Initial status
      });
      console.log(order.totalAmount)

      // Save the order to the database
      await order.save();

      // Clear the user's cart
      await cart.clearCart();

      
      return res.render('users/cod',{order}); 
    } else if (paymentMethod === 'Credit Card') {
      
      return res.send('stripe-payment');
    } else {
      return res.status(400).send('Invalid payment method.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = { renderCheckout, checkoutController };
