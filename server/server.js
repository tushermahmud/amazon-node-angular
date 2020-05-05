const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :false}));
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: true}));


mongoose.connect(config.database,{useUnifiedTopology:true,useNewUrlParser:true},(err)=>{
    if(err){
        console.log(err);
    }
    else{
    }

});



app.listen(config.port ,(err)=>{
   console.log("this is the port " + config.port +" and i am sazzad mahmud running it");
});

app.get('/',(req,res,next)=>{
    res.json({
       user:'tusher',
    });
});

const userRoutes=require('./routes/account');
app.use('/api/accounts',userRoutes);