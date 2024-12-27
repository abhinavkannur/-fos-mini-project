
const User=require('../models/user');
const  Admin=require('../models/admin');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')



const viewusers=async(req,res)=>{
  try{

  
  const users=await User.find();//fetch all users
  res.render('admin/userdetails',{users});

}catch(err){
  console.error('error in fetching users:',err);
  res.status(500).send('server error');
}
};
//render  admin login page
const renderadminlogin=(req,res)=>{
  res.render('admin/adminlogin');
}

const adminlogin=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const admin=await Admin.findOne({email});
    if(!admin || admin.password!==password){
      return res.render('admin/adminlogin',{error:'invalid email or password'})
    }
    //gnerate token
    const token=jwt.sign({adminId:admin._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.render('admin/admindashbord');

  }catch(error){
    console.log(error,"error in admin login");
    res.status(400).send('server errorr');
  }
};





module.exports={viewusers,renderadminlogin,adminlogin};
