const express=require('express');

const {  viewusers, renderadminlogin, adminlogin, adminlogout, renderadmindash, blockuser, unblockuser } = require('../controllers/admincontroller');
const {  renderaddproductform, addproduct, viewmenu } = require('../controllers/addproduct');
const { rendercategories, createcategory, deletecategory } = require('../controllers/category');
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

router.get('/viewmenu',viewmenu)

//category

router.get('/categories',rendercategories);
router.post('/categories',createcategory);
router.post('/categories/:id',deletecategory);


//logout
router.get('/adminlogout',adminlogout)

router.get('/admindash',renderadmindash)

//block and unblock user

router.post('/users/block/:id',blockuser);
router.post('/users/unblock/:id',unblockuser)

module.exports=router;