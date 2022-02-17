const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Ecom')
.then(()=>{
    console.log('Connected to mongodb');
}).catch(()=>{
    console.log('Error in mongodb');
})
