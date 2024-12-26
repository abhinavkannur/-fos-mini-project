const express=require('express');
const {  viewusers, renderadminlogin, adminlogin } = require('../controllers/admincontroller');
const router=express.Router();

router.get('/users',viewusers);
router.get('/adminlogin',renderadminlogin);


router.post('/adminlogin',adminlogin)
module.exports=router;