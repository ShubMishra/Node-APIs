const express =require("express");
const mongoose =require("mongoose");
const bodyParser=require("body-parser");


const app =express();
const PORT =2000;
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:2717/products",{
    useNewUrlParser:true,
    

});
const db=mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));

db.once("open",function(){
    console.log('Connected to mongo DB');
});

//Product Schema

const productSchema=new mongoose.Schema({
    cost:Number,
    weight:Number,
    id:{
        type:String,
        unique:true,
    },
    name: String,
    productDetails:{
        description:String,
        count:Number,
        designer:String,
    },
});
const Product=mongoose.model("Product",productSchema);


//Fetch all Products
app.get("/allProducts",function(req,res){
Product.find({},(err,products)=>{
    if(err)
    {
        return res.status(500).send(err);
    }
    console.log(products);
    return res.status(200).send(products);

})
});

//Fetch a unique Product
app.get('/products/:id',function (req,res) {
    Product.findOne({id:req.params.id},function(err,product){
        if(err){
            return res.status(500).send(err);
        }
        if(!product){
            return res.status(404).send("Product not found");
        }
        return res.status(200).send(product);
    });
    
});

//Add a new Product
app.post('/products',(req,res)=>{
    // console.log(req.body);
    // console.log("Recieved Req");
    const newProduct=new Product(req.body);
    newProduct.save((error,product)=>{
        if(error)
        {return res.status(500).send(error);}
        console.log("Req ended",product);

        return res.status(201).send(product);
    });
});

//Modify A product
app.put("/product/:id",(req,res)=>{
    console.log(req.params.id);
// console.log(req..id)
    Product.findOneAndUpdate({id:req.body.id},req.body,(err,product)=>{
        if(err){
            return res.status(500).send(err);
        }
        if(!product)
        {
            res.status(404).send("Product not found!");
        }
        return res.status(200).send(product);
    });
});


//Delete a Product
app.delete("/products/:id",(req,res)=>{
    console.log(req.params.id);
    Product.findOneAndDelete({id:req.params.id},(err)=>{
        if(err)
        return res.status(500).send(err);

        return res.send("Product successfully deleted");
    });
})


app.listen(PORT,function () {
    console.log("SERVER IS RUNNING AT 2000");
});