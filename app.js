require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('Type of MONGO_URI:', typeof process.env.MONGO_URI);
const express= require('express');
const app=express();
const path= require('path');
const mongoose = require('mongoose'); 

const userModel= require('./models/user')


app.set("view engine",'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);
app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/read',async(req,res)=>{
   let allUsers=  await userModel.find()
    res.render('read',{users:allUsers});
})

app.get('/delete/:userid',async(req,res)=>{
   let users= await userModel.findOneAndDelete({_id:req.params.userid});
   res.redirect("/read");
 })

 app.get('/edit/:userid',async(req,res)=>{
    let user= await userModel.findOne({_id:req.params.userid});
    res.render('edit',{user:user});
  })

  app.post('/update/:userid',async(req,res)=>{
    let {image,name,email}=req.body;
    let user= await userModel.findOneAndUpdate({_id:req.params.userid},{image:image,email:email,name:name},{new:true});
    res.redirect('/read');
  })

app.post('/create',async (req,res)=>{
    let {name,email,image}=req.body;
   let CreatedUser= await userModel.create({
        name:name,
        email:email,
        image:image
    });
    res.redirect('/read');
})

app.listen(3000);