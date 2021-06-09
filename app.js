const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost/page' ,{ useNewUrlParser: true , useUnifiedTopology: true  });


const db = mongoose.connection;

//adding data manually here itself
db.once('open' , async () => {
    if(await User.countDocuments().exec() > 0) return
   
  
    Promise.all([
        User.create({name:'User 1'}),
        User.create({name:'User 2'}),
        User.create({name:'User 3'}),
        User.create({name:'User 4'}),
        User.create({name:'User 5'}),
        User.create({name:'User 6'}),
        User.create({name:'User 7'}),
        User.create({name:'User 8'}),
        User.create({name:'User 9'}),
        User.create({name:'User 10'}),
        User.create({name:'User 11'}),
        User.create({name:'User 12'})
    ]).then(() => console.log('users added'));

})

const pagination = (model) => {
    return async (req,res,next) =>{
        const page = parseInt(req.query.page);    
        const limit = parseInt(req.query.limit);    
        
        const startIndex = (page-1) * limit;
        const endIndex = page * limit;
     
        const result = {};
        if(endIndex < await model.countDocuments().exec())
        result.next = {
                page : page + 1 ,
                limit : limit
            }
        if(startIndex > 0) {
            result.previous = {
                page : page - 1,
                limit: limit
            }
        }
        result.result = await model.find().limit(limit).skip(startIndex).exec();
        res.pagination = result;
        next();
    }
}

app.get('/' , (req,res) => {
    User.find().exec((err,users) => {
        res.json(users);
    })
})

app.get('/users' , pagination(User),  (req, res) => {
    res.json(res.pagination);
});



app.listen(8000);