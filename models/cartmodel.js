const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

cartSchema.methods.removeProduct = function(productId, callback) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  this.save(callback);
};

cartSchema.methods.increaseQuantity = function(productId, callback) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  if (item) {
    item.quantity += 1;
    this.save(callback);
  } else {
    callback(new Error('Product not found in cart'));
  }
};

cartSchema.methods.decreaseQuantity = function(productId, callback) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    this.save(callback);
  } else if (item) {
    callback(new Error('Quantity cannot be less than 1'));
  } else {
    callback(new Error('Product not found in cart'));
  }
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
