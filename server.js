'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());

const PORT = process.env.PORT;;

//home 


server.get('/', (request, response) => {

  response.send('home page received')

})

//access req.body
server.use(express.json());

// mongodb
const mongoose = require('mongoose');

let bookMod;
main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://localhost:27017/Books');
  await mongoose.connect(process.env.MONGO_URL);
   
  const  bookschema= new mongoose.Schema({
    title:String,
    description:String,
    status:String,
    authoremail:String
  });

  bookMod =mongoose.model('Books',bookschema);
  // seedData();
}

async function seedData(){
  const Book1=new bookMod({
    title:'War and Peace',
    description:'From the award-winning translators of Anna Karenina and The Brothers Karamazov comes this magnificent new translation of Tolstoy’s masterwork.',
    status:'https://images4.penguinrandomhouse.com/cover/9781400079988',
    authoremail:'email2@gmail.com'
  });

  const Book2=new bookMod({
    title:'Song of Solomon',
    description:'One must always read a novel by this Nobel Prize winning author.',
    status:'https://images3.penguinrandomhouse.com/cover/9781400033423',
    authoremail:'email2@gmail.com'
  });

  const Book3=new bookMod({
    title:'Ulysses',
    description:'by James Joyce Joyces parallel use of The Odyssey…has the importance of a scientific discovery',
    status:'https://images3.penguinrandomhouse.com/cover/9780679722762',
    authoremail:'email3@gmail.com'
  });

  await  Book1.save();
  await  Book2.save();
  await  Book3.save();

}
//Routes
server.get('/books',getBookHandler);
server.post('/addBook',addBookHandler);
server.delete('/deleteBook/:id',deleteBookHandler);
server.put('/updateBook/:id',updateBookHandler);


// Handlers Functions 
function getBookHandler(req,res){
  //send book list (email)
  const email=req.query.email;
bookMod.find({authoremail:email},(err,result) =>{
  if(err){
    console.log(err);
  }
  else{
    res.send(result);
  }
})
}

async function addBookHandler(req,res){
  console.log(req.body);
  // const catName = req.body.catName;
  // const catBreed = req.body.catBreed;
  // const ownerEmail = req.body.ownerEmail;
  const {title, description, status,authoremail} = req.body;
  await   bookMod.create({ 
    title: title,
    description: description,
    status:status,
    authoremail:authoremail
  });

  // await KittenModel.create({catName,catBreed,ownerEmail});

  bookMod.find({authoremail:authoremail},(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      else
      {
          res.send(result);
      }
  })

}

function deleteBookHandler(req,res){
  const bookId = req.params.id;
  const email = req.query.email;
  bookMod.deleteOne({_id:bookId},(err,result)=>{
      
    bookMod.find({authoremail:email},(err,result)=>{
          if(err)
          {
              console.log(err);
          }
          else
          {
              res.send(result);
          }
      })

  })


}


function updateBookHandler(req,res) {
  const id = req.params.id;
  const {title, description,email} = req.body;
  
  bookMod.findByIdAndUpdate(id,{title,description},(err,result)=>{
    bookMod.find({authoremail:email},(err,result)=>{
          if(err)
          {
              console.log(err);
          }
          else
          {
              res.send(result);
          }
      })
  })
}



server.listen(PORT, () => console.log(`listening on ${PORT}`));


