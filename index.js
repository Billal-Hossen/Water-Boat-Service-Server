

const express=require("express")
const bodyParser=require("body-parser")
const cors=require("cors")
const fileUpload=require("express-fileupload")
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = 8080;

const app = express()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gyuhd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




app.use(bodyParser.json());
app.use(cors());
app.use(express.static('boats'));
app.use(fileUpload());





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("waterBoat").collection("boats");
  const reviewCollection = client.db("waterBoat").collection("reviews");
  const bookingCollection = client.db("waterBoat").collection("bookings");
  const adminCollection = client.db("waterBoat").collection("admin");
app.post("/addBoat",(req,res)=>{
    const file=req.files.file;
    // console.log(file)
    const name=req.body.name;
    const price=req.body.price;
    const berth=req.body.berth;
    const country=req.body.country;
    const long=req.body.long;
    const cabin=req.body.cabin;
    const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ name,price,country,long,berth,cabin,image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })

})

app.get('/boats', (req, res) => {
    serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});
app.get('/SearchBoat', (req, res) => {
    serviceCollection.find({})
        .toArray((err, doc) => {
            res.send(doc);
        })
});
app.delete('/delete/:id', (req,res) => {
    serviceCollection.deleteOne({_id:ObjectId( req.params.id)})
    .then((result)=> {
     
    })
  })


app.post("/addReview",(req,res)=>{
    const file=req.files.file;

    const text=req.body.text;
    console.log(text,file)
    
    const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        reviewCollection.insertOne({ text,image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })

})

app.get('/reviews', (req, res) => {
    reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});
app.post('/addBooking',(req,res)=>{
    const info=req.body
    reviewCollection.insertOne({info})
    .then(results => {
        res.send(results.insertedCount > 0);
    })

})


app.post('/addAdmin',(req,res)=>{
    const newAdmin=req.body;
    console.log(newAdmin)
    adminCollection.insertOne(newAdmin)
    .then(result=>{
        // console.log(result.insertedCount)
        res.send(result.insertedCount>0)
    })

})
app.post('/findAdmin',(req,res)=>{
    const email=email.body.email;
    adminCollection.find({email:email})
    .toArray((err,items)=>{
        res.send(items.length > 0)
    })
})


});



app.get('/',(req,res)=>{
    res.send("hello from db its working")
}
)

app.listen(process.env.PORT || port)
