const express=require('express');

const {  viewusers, renderadminlogin, adminlogin, adminlogout, renderadmindash, blockuser, unblockuser } = require('../controllers/admincontroller');
const {  renderaddproductform, addproduct, viewmenu, updatemenu, renderupdatemenu, deletemenuitem } = require('../controllers/addproduct');
const { rendercategories, createcategory, deletecategory } = require('../controllers/category');
const {addToCart, viewcart}=require('../controllers/cartcontroller')
const router=express.Router();
const upload=require('../utils/multer-cloudinary');

//multer setup

//admin login
router.get('/adminlogin',renderadminlogin);
router.post('/adminlogin',adminlogin)

//render suer details
router.get('/users',viewusers);

//render add product
router.get('/addproduct',renderaddproductform);
router.post('/addproduct',upload.single('image'),addproduct);

//view and update menu
router.get('/viewmenu',viewmenu)
router.get('/updatemenu/:id',renderupdatemenu);
router.post('/updatemenu/:id',upload.single('image'),updatemenu);
router.post('/deletemenu/:id',deletemenuitem)

//category

router.get('/categories',rendercategories);
router.post('/categories',createcategory);
router.post('/categories/:id',deletecategory);


//logout
router.get('/adminlogout',adminlogout)

router.get('/admindash',renderadmindash)

//block and unblock user

router.post('/users/blockuser/:id',blockuser);
router.post('/users/unblockuser/:id',unblockuser)

// cart
router.post('/cart/add',addToCart)
router.get('/cart',viewcart);

module.exports=router;