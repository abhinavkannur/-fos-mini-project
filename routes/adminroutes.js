const express=require('express');

const {  viewusers, renderadminlogin, adminlogin, adminlogout,  blockuser, unblockuser } = require('../../controllers/admincontroller');
const {  renderaddproductform, addproduct, viewmenu, updatemenu, renderupdatemenu, deletemenuitem } = require('../../controllers/addproduct');
const { rendercategories, createcategory, deletecategory } = require('../../controllers/category');
const router=express.Router();
const upload=require('../multer-cloudinary');
const { renderslider, addslider, rendermanageslider, updateslider, deleteslider} = require('../../controllers/bannercontrol');
// const { render } = require('ejs');
// const { addcart } = require('../controllers/cart');

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

// router.get('/admindash',renderadmindash)

//block and unblock user

router.post('/users/blockuser/:id',blockuser);
router.post('/users/unblockuser/:id',unblockuser)


//banner
router.get('/banners',renderslider)
router.post('/addslider',upload.single('image'),addslider);
router.get('/slidermanagement',rendermanageslider)

router.post('/update-slider',updateslider)
router.post('/delete-slider/:id',deleteslider);

module.exports=router;