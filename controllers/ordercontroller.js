const Order = require('../models/order');

const renderAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find({})
      .populate('user') // Populate user details
      .populate('items.product') // Populate product details
      .sort({ createdAt: -1 }); // Sort by newest orders first

    // Render the admin order details view
    res.render('admin/orderdetails', {
      orders,
      message: orders.length > 0 ? null : 'No orders found.',
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).send('Error fetching orders.');
  }
};

module.exports = { renderAllOrders };
