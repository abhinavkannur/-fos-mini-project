const express=require('express')
const router=express.Router();
const {renderhomepage, renderabout, rendercontact, rendermenu,rendercart,rendercheckout,rendersingleproduct,render404}=require('../controllers/homecontroller');
const {renderloginpage, signup, verifyotp, login,renderforgotpassword, forgotpassword, forgotpasswordotp, resetpassword,   }=require('../controllers/authcontroller')
router.get('/',renderhomepage);
router.get('/about',renderabout);
router.get('/contact',rendercontact);
router.get('/menu',rendermenu);
router.get('/cart',rendercart);
router.get('/checkout',rendercheckout);
router.get('/singleproduct',rendersingleproduct);
router.get('/404',render404);
router.get('/profile',renderloginpage)
router.post('/signup',signup);
router.post('/verify-otp',verifyotp)
router.post('/login',login)
router.get('/forgotpassword',renderforgotpassword);
router.post('/forgotpassword',forgotpassword);
router.post('/forgotpassword-otp',forgotpasswordotp);
router.post('/resetpassword',resetpassword)

module.exports=router;