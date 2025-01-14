
const User=require('../models/user');
const  Admin=require('../models/admin');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');




const viewusers=async(req,res)=>{
  try{

  
  const users=await User.find();//fetch all users
  res.render('admin/viewuser',{users});

}catch(err){
  console.error('error in fetching users:',err);
  res.status(500).send('server error');
}
};
//render  admin login page
const renderadminlogin=(req,res)=>{
  res.render('admin/adminlogin',{success:null,error:null});
}

const adminlogin=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const admin=await Admin.findOne({email});
    if(!admin || admin.password!==password){
      return res.render('admin/adminlogin',{success:null,error:'invalid email or password'})
    }
    //gnerate token
    const token=jwt.sign({adminId:admin._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.render('admin/admindash',{success:'welcome admin',error:null});

  }catch(error){
    console.log(error,"error in admin login");
    res.render('admin/adminlogin',{success:'invalid credilance',error:null});
  }
};


//adminlogout
const adminlogout=(req,res)=>{
  res.clearCookie('token');
  res.redirect('/adminlogin');
}



const blockuser=async(req,res)=>{
  try{
    const userId=req.params.id;
    const user=await User.findByIdAndUpdate(userId,{isBlocked:true},{new:true});
    if(user){
      res.redirect('/users')
    }else{
      res.status(404).send('user not found');
    }
  }catch(error){
    console.error(error);
    res.status(400).send('internal server error');

  }
};
const unblockuser=async(req,res)=>{
  try{
    const userId=req.params.id;
    const user=await User.findByIdAndUpdate(userId,{isBlocked:false},{new:true});

    if(user){
      res.redirect('/users');
    }else{
      res.status(404).send('user not found');
    }
  }catch(err){
    console.error(err);
    res.status(500).send('internal server error');
  }
}


module.exports={viewusers,renderadminlogin,adminlogin,adminlogout,blockuser,unblockuser};
