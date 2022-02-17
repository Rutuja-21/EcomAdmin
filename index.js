const express = require('express');
const app = express();
const path = require("path");
require("./src/connection/conn")
const bodyParser = require('body-parser')
const reg = require("./src/db/db")
const proadd = require("./src/db/db")
const cookieParser = require('cookie-parser')
const multer = require('multer');
const res = require('express/lib/response');

app.use(bodyParser())
app.use(express.json());
app.use(cookieParser())

const static = path.join(__dirname,"/public")
const htmll =  path.join(__dirname,"/public/register.html")
 
app.use(express.static(static))
app.set('view engine','html')

app.get('/',(req,res)=>{
    res.render("index")
})

app.get("/register",(req,res)=>{
    res.sendFile(htmll)
})

app.get("/dashboard",(req,res)=>{
    res.sendFile(path.join(__dirname,"/public/panel.html"))
})

app.get("/addproduct",(req,res)=>{
    res.sendFile(path.join(__dirname,"/public/postdata.html"))
})



app.post('/register',async(req,res) =>{
    const regi = new reg({
        email:req.body.email,
        password : req.body.password
    })

    const token = await regi.generateAuthToken();
    console.log(token);
    
    await regi.save();
    res.redirect("/")
    
})

app.post('/login',async(req,res) =>{

        const user = await reg.findOne({email : req.body.email});

        if( user == null){
            res.send("fail")
        }
        else if (user.email === req.body.email && user.password === req.body.password) {
            const token = await user.generateAuthToken();
            res.cookie("jwt" , token, {
                expires : new Date (Date.now() + 900000),
                httpOnly : true
            })
            res.redirect("/dashboard")
        } else {
            res.send("Login Fail")
        }

        
        
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })

  

app.post("/postdata", upload.single("imgname"),async(req,res)=>{
    const imglink = `http://localhost:5000/img/${req.file.filename}`
    console.log(imglink);
   const pro = new proadd({
    title : req.body.title,
    category : req.body.cat,
    img : imglink,
    desc : req.body.desc,
    price : req.body.price
   })

   

   if (await pro.save()) {
       res.send("done")
   } else {
       res.redirect("/addproduct")
   }

  


})



app.get("/api",async(req,res)=>{
    res.set('Access-Control-Allow-Origin', '*');
    const a = await proadd.find();
    res.send(a);

    
});




app.listen(5000,()=>{
    console.log("5000 PORT CONNECTION SUCCESFULL");
}); 

