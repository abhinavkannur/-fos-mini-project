const Product=require('../models/product');
const Category=require('../models/category');
const { parse } = require('dotenv');

//render add product form

const renderaddproductform=async(req,res)=>{
  try{
    const categories= await Category.find();
    res.render('admin/addproduct',{categories});
  }catch(err){
    console.error('error in rednering add product form:',err);
    res.status(400).send('server error');
  }
}

const addproduct=async (req,res)=>{
  try{
    const {name,description,price,category}=req.body
    const imageUrl=req.file.path;

    const product=new Product({
      name,
      description,
      price,
      category,
      image:imageUrl, //save the cloudinary image url
    })
    await product.save()
      res.redirect('/addproduct');
    
  }catch(err){
    console.error('error fetching products',err);
    res.status(500).send('server error');
  }
}


const getproduct=async (req,res)=>{
  try{
    const page=parseInt(req.query.page)||1//current page
    const limit=10;//number of products per page
    const skip=(page-1)*limit//number of products to skip

    const products=await Product.find()
    .populate('category')
    .skip(skip)
    .limit(limit);
    
    const totalProducts=await Product.countDocuments();
    const totalpages=Math.ceil(totalProducts/limit);

    const categories=await Category.find();
    res.render('users/shop',{products,categories,currentpage:page,totalpages})

   
  }catch(err){
    console.error('error fetching products',err)
     res.status(400).send('server error')
  }
};

//view menu

const viewmenu=async(req,res)=>{

  try{
    const menuitems= await Product.find().populate('category');

    res.render('admin/viewmenu',{menuitems});

    }catch(error)
    {
      console.error('error in fetching aLL PRODUCT DETAILS',error)
    }

  }


 const  renderupdatemenu=async(req,res)=>{
    try{
      const menuitem=await Product.findById(req.params.id);
      const categories=await Category.find();
      if(!menuitem){
        return res.status(404).send('menu items not found');      
      }
      res.render('admin/updatemenu',{menuitem,categories});
    }catch(error){
      console.error(error)
      res.status(404).send('internal server error');
    }
  };

const updatemenu=async (req,res)=>{
  try{
    const {name,description,price,category,image}=req.body;
    const updatemenuitems=await Product.findByIdAndUpdate(req.params.id,{name,description,price,category,image},{new:true});
  
  if(!updatemenu){
    return res.status(404).send('menu item not found');
  }
  res.redirect('/viewmenu')
}catch(error){
  console.error(error)
  res.status(404).send('interanal server erorr');
}
}
const deletemenuitem=async(req,res)=>{
  try{
    const menuitem=await Product.findByIdAndDelete(req.params.id);
    if(!menuitem){
      return res.status(404).send('menu item not found');
    }
    res.redirect('/viewmenu')
  }catch(error){
    console.error(error);
    res.status(404).send('internal server error');
  }
}


  

module.exports={renderaddproductform,addproduct,getproduct,viewmenu,renderupdatemenu,updatemenu,deletemenuitem}