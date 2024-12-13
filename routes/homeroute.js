const express=require('express')
const router=express.Router();
const {renderhomepage, renderabout, rendercontact, rendermenu,rendercart,rendercheckout,rendersingleproduct,render404, renderloginpage}=require('../controllers/homecontroller');

router.get('/',renderhomepage);
router.get('/about',renderabout);
router.get('/contact',rendercontact);
router.get('/menu',rendermenu);
router.get('/cart',rendercart);
router.get('/checkout',rendercheckout);
router.get('/singleproduct',rendersingleproduct);
router.get('/404',render404);
router.get('/profile',renderloginpage)

module.exports=router;