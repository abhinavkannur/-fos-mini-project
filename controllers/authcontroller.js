const User=require('../models/user');
require('dotenv').config();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieparser=require('cookie-parser');
const nodemailer=require('nodemailer');
const crypto=require('crypto');
const Slider=require('../models/bannermodel')

const Banner=require('../models/bannermodel');
const { log } = require('console');

// nodemailer setup
const transporter=nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth:{
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,     
  }
});


//rnderhomepage
const renderhomepage = async (req, res) => {
  try {
    // Fetch the slider data from the database
    const sliders = await Banner.find();
    console.log(res.locals.user)
    // if(res.locals.user){
    //   res.render('users/index_2', { sliders, success: null, error: null, user:res.locals.user });
    // }
    // Render the page and pass the sliders
    res.render('users/index_2', { sliders, success: null, error: null , user : res.locals.user});
  } catch (error) {
    console.error('Error fetching sliders:', error);

    // Render the page with an error message if fetching sliders fails
    res.render('users/index_2', { sliders: [], success: null, error: 'Failed to load sliders', user : null });
  }
};


// render signnup login page

const renderloginpage=(req,res)=>{
  res.render('users/loginpage',{success:null,error:null});
}




// signup
const signup=async(req,res)=>{
  try{
  const{fullName,email,mobile,password}=req.body;

  // check if  user alaready exists

  const existinguser=await User.findOne({email});
  if(existinguser){
   return res.render('users/loginpage',{success:'user already exits',error:null});
  }

  //hashpassword and create new user

   const hashedpassword=await bcrypt.hash(password,10);
  const user=new User({fullName,email,mobile,password:hashedpassword});
  await user.save();

  // generate otp and save it to the user

  const otp=crypto.randomInt(100000,1000000);
  user.otp=otp;
  user.otpExpiry=Date.now()+10 * 60 * 1000 //expire in 10minutes
  await user.save();

  const mailOption={
    to:email,
    from:process.env.MAIL_USER,
    subject:'OTP VERIFICATION',
    text:`your otp code is ${otp}`,
  };
  transporter.sendMail(mailOption,(error)=>{
    if(error){
      return res.status(500).json({message:'error in otp email'});
  }
  return res.render('users/otp',{userId:user._id});
  });
}catch(err){
  console.error('signup error',err);
  res.status(500).json({message:'internal server error'});
}
  };


  //verify otp
  const verifyotp=async(req,res)=>{

    try{
      const {userId,otp}=req.body;

   // Combine the OTP array into a single string
   
      const fullotp=otp.join('')
      if (!userId || !fullotp) {
        console.log('User ID or OTP missing');
        return res.render('users/otp', { userId, success: 'User ID or OTP missing',error:null });
      }
  
    //find user in the db

    const user=await User.findById(userId);
    if(!user){
      console.log('user not found')
      return res.render('users/otp',{userId,success:'user not found',error:null});
     }

    //check if the otp has expired

      if(Date.now()>user.otpExpiry){
        console.log('otp expired')
        return res.render('users/otp',{userId,success:null,error:'otp expired'});
        }

      //validate the otp

    if(user.otp!==fullotp){
      console.log('incorrect otp')
      return res.render('users/otp',{userId,success:null,error:'invalid otp'});
      
    }
    //make the user verified
    user.isVerified=true;
    user.otp=null;
    user.otpExpiry=null;
    await user.save();

    // generate jwt token

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
    res.cookie('token',token,{httponly:true});
    console.log('signup sucessfull')
    return res.redirect('/');

    
  }
  catch(error){
    console.error('error verifying OTP:',error);
    res.status(500).send('invalid serever errorr');
  }
};



//login
const login=async(req,res)=>{
  try{

    const{email,password}=req.body;
    const user=await User.findOne({email});
    if(user.isBlocked){
      return res.render('users/404')
    }

    if(!user||!user.isVerified){
      return res.render('users/loginpage',{success:null,error:'please verify your acc first'})
    }

    const ismatch=await bcrypt.compare(password,user.password);
    if(!ismatch){
      return res.render('users/loginpage',{success:null,error:'invalid credentials'});
       }
       let sliders = [];
   
      sliders = await Slider.find(); 

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
  res.cookie('token',token,{httponly:true})
  console.log('login sucessfull');
  return res.render('users/index_2',{success:`welcome ${user.fullName}`,error:null,sliders});
  }catch(error){
    console.log(error);
    res.render('users/loginpage',{success:null,error:"invalid credilince"})
  }
}



// forgotpassword
const renderforgotpassword=(req,res)=>{
  res.render('users/forgotpassword')
}

const forgotpassword=async(req,res)=>{
  try{
    const {email}=req.body;
    const user=await User.findOne({email})
    if(!user){
      return res.send('user not found');
    }
    const otp=crypto.randomInt(100000,1000000);
    user.otp=otp;
    user.otpExpiry=Date.now()+10*60*100;
    await user.save();
    
    const mailOptions = {
      to: email,
      from: process.env.MAIL_USER, // Sender's email (ensure it's stored securely in your env variables)
      subject: 'RESET PASSWORD OTP Verification',
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    };
    transporter.sendMail(mailOptions,(error)=>{
      if(error){
        return res.status(500).json({messsage:'error sending otp email'});
      }
      return res.render('users/forgotpassword-otp',{userId:user._id});
    })
      }catch(error){
      console.log(error);
      res.status(400).send('error in otp generating')
      }
    }

    
    //forgot otp

    const forgotpasswordotp=async(req,res)=>{
      try{

      const{otp,userId}=req.body;

      if(!userId){
        console.log('user id  missing')
        return res.status(400).send('user id missing');
      }

      const user=await User.findById(userId);
      if(!user){                                                                                                                                                                                                                                                                                                                                                                        
        console.log('user not found')
        return res.status(404).send('user not found');

      }
      console.log(`Entered OTP: ${otp}`);
      console.log(`Stored OTP: ${user.otp}`);
      console.log(`OTP Expiry: ${user.otpExpiry}`);
      console.log(`Current Time: ${Date.now()}`);

      const otpString = otp.join(''); 
      
      if (user.otp !== otpString || user.otpExpiry < Date.now()) {
  console.log('Invalid or expired OTP');
  return res.render('users/forgotpassword-otp', {
    userId: user._id,
    message: 'Invalid or expired OTP. Please try again.',
  });
}

      // Optionally, you can convert it to a number if you need
       
      console.log(otpString);
      if(user.otp===otpString){
        console.log('equal')
      }
      else{
        console.log('not equal')
      }
      
      if(user.otp !==otpString || user.otpExpiry<Date.now()){
        console.log('Invalid or expired OTP');
        return res.render('users/forgotpassword-otp',{userId:user._id,message:'invalid or expired otp please try agian'});
      }
      user.otp=null;
      user.otpExpiry=null;
      await user.save();
      res.render('users/resetpassword',{userId:user._id,message:''})
      
    }catch(error){
      console.log('otp verification error:',error);
      res.status(500).send('internal server erroro') 
    }
    

    };
    
   //RESETPASSWORD  

   const resetpassword=async(req,res)=>{
    try{
      const {userId,password,confirmpassword}=req.body;
      if(!password||!confirmpassword){
        console.log('plz enter all fileds')
        return res.render('users/resetpassword',{userId,message:'please fill in all fileds'})
       
      }
      if(password!=confirmpassword){
        console.log('password not matching')
        return res.render('users/resetpassword',{userId,message:'password do not match'})
       
      }

      //hash the new password
      const hashedpassword=await bcrypt.hash(password,10);
      //update the password from db
      const user=await User.findById(userId);
      if(!user){
        console.log('user not found');
        return res.status(404).send('user not found');
      
      }
      user.password=hashedpassword;
      await user.save();
      console.log('password updated');
      res.render('users/loginpage',{message:'password reset sucessfully please login'})
      console.log('updated sucss fully');
    }catch(err){
      console.log(err)
      res.status(500).send('internal server errror');
          }
        };
        
  //render user dashbord
        const renderuserdashbord=async(req,res)=>{
          try{

            const token =req.cookies.token;
            if(!token){
              return res.redirect('/login')

            }
            //verify and decose the token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            const userId=decoded.userId;
            console.log(userId);

            if(!userId){
              return res.status(400).send('unauthorized: user not  logged in');
            }
            // fetch user details from database
            const user= await User.findById(userId);
            if(!user){
              return res.status(404).send('user not found');
            }
            res.render('users/userdashbord',{user});
          }catch(err){
            if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
              return res. redirect('/login')
          }
            console.log(err);
            res.status(500).send('server error')
          }
        };

        //render profile

      const renderuserprofile=async(req,res)=>{
        try{
          const token=req.cookies.token;//extract token from cookies
          if(!token){
            return res.redirect('/login')

          }

          //verify and decoded the token
          const decoded=jwt.verify(token,process.env.JWT_SECRET);
          const userId=decoded.userId;
          console.log(userId);

          const user=await User.findById(userId);
          if(!user){
            res.status(400).send('suer not found');
          }
          
          res.render('users/profile',{user});
        }catch(err){
          console.log('error in render profile:',err);
          res.status(500).send('server error');
        }
      };
        

       //update user details

       const updateprofile=async (req,res)=>{
        try{
          const token=req.cookies.token;
          if(!token){
            return res.status(400).send('unauthorized :user nopt logged in');

      }
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      const userId=decoded.userId;
      const {fullName,email,mobile}=req.body;

      //updated users details
      const user=await User.findByIdAndUpdate(userId,{fullName,email,mobile},{new:true}

      );
      res.render('users/profile', { user, message: 'Profile updated successfully'})
          
       }catch(error){
        console.log(error)
        res.status(400).send('serever error');
       }
      }

      //logout
      const logout=async (req,res)=>{
        res.clearCookie('token');
        const sliders = await Banner.find();
        res.render('users/index_2', { sliders, success: null, error: null , user : null});
      };

      const loginout= async(req,res)=>{
        res.clearCookie('token');
        const sliders = await Banner.find();
        res.render('users/index_2', { sliders, success: null, error: null , user : null});
      };

      
        
   

 



module.exports={loginout,renderhomepage,forgotpassword,signup,verifyotp,login,renderloginpage,renderforgotpassword,forgotpasswordotp,resetpassword,renderuserdashbord,renderuserprofile,updateprofile,logout}