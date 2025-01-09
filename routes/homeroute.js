const express=require('express')
const router=express.Router();

const { renderabout, rendercontact,rendercart,rendercheckout,rendersingleproduct,render404, }=require('../controllers/homecontroller');
const {renderloginpage, signup, verifyotp, login,renderforgotpassword, forgotpassword, forgotpasswordotp, resetpassword, renderuserdashbord, renderuserprofile, updateprofile, logout, renderhomepage}=require('../controllers/authcontroller');
const { getproduct } = require('../controllers/addproduct');
const cartController=require('../controllers/cartcontrol');

router.get('/',renderhomepage);
router.get('/about',renderabout);
router.get('/contact',rendercontact);
router.get('/menu',getproduct);
router.get('/cart',rendercart);
router.get('/checkout',rendercheckout);
router.get('/singleproduct',rendersingleproduct);
router.get('/404',render404);
router.get('/login',renderloginpage)
router.post('/signup',signup);
router.post('/verify-otp',verifyotp)
router.post('/login',login)
router.get('/forgotpassword',renderforgotpassword);
router.post('/forgotpassword',forgotpassword);
router.post('/forgotpassword-otp',forgotpasswordotp);
router.post('/resetpassword',resetpassword)
router.get('/user-dashbord',renderuserdashbord);
router.get('/profile',renderuserprofile)                                                                                                                                                                                                                                                                                                                                                                                                                       
router.post('/update-profile',updateprofile)
router.post('/logout',logout)

router.post('/cart/add',cartController.addcart);
router.get('/cart1',cartController.rendercart)
router.post('/cart/increase',cartController.increaseitem);
router.post('/cart/decrease',cartController.decreaseitem);


module.exports=router;