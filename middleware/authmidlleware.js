const jwt=require('jsonwebtoken');

//middleware to verify the jwt and add decoded user data to req.usetr

const authenticateuser=(req,res,next)=>{
try{
  const authHeader=req.headers.authorization;
  if(!authHeader){
    return res.status(401).send('Unauthorized: No token provided');
  }
  const token=authHeader.split(' ')[1];

  if(!token){
    return res.status(401).send('Unauthorized: No token provided');

  }
  const decoded=jwt.verify(token,process.env.JWT_SECRET);
  req.user=decoded;
  next();
  }catch(error){
    console.log(error);
    res.status(401).send('Unauthorized: Invalid token');
  }
}
module.exports=authenticateuser