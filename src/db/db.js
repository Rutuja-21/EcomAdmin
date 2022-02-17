const mongoose = require("mongoose");
// require("../connection/conn")
const multer = require('multer');
var jwt = require('jsonwebtoken');

const ereg = new mongoose.Schema ({
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    tokens:[{
        token:{
            type : String
        }
    }]
})

ereg.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this.id}, "asderfdertgfvbhyuhbghyujkluiopl");
        this.tokens = this.tokens.concat({token : token})
        await this.save()
    } catch (error) {
        console.log(`Error ${error}`);
    }
}


const reg =  mongoose.model("register" , ereg);

module.exports = reg;





const aprod = new mongoose.Schema({
    title : String,
    category : String,
    img : String,
    desc : String,
    price : Number
})

const proadd = mongoose.model("addproduct", aprod)

module.exports = proadd;







