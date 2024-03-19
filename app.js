const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require ("path");
const ejs= require('ejs');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB ");
})
.catch((err)=>{
    console.log(err);
});


async function main (){
    await mongoose.connect(MONGO_URL);
}

app.set ("view engine" , "ejs");
app.set ("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res)=>{
    res.send("hi , I am root");
});
//index route  

app.get("/listings",async (req,res)=>{
   const allListings = await Listing.find({});
   res.render('listings/index',{allListings})
    });

    //new route

    app.get('/listings/new',(req,res)=>{
        res.render('listings/new');
    });

    //show route

    app.get("/listings/:id",async (req,res)=>{
        let {id}= req.params;
        const listing = await Listing.findById(id);
        res.render('listings/show',{listing});
    });

    //create route

    app.post("/listings", async (req, res)=>{
        const newListing= new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    });

    //edit route

    app.get("/:id/edit", async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render('listings/edit', { listing });
    });
    
    //update route
    app.put("/listings/:id", async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id ,{...req.body.listing});
        res.redirect("/listings");
    });

    //delete route
    app.delete("/listings/:id", async (req, res) => {
        try {
            let { id } = req.params;
            let deletedListings = await Listing.findByIdAndDelete(id);
            if (!deletedListings) {
                return res.status(404).json({ success: false, message: "Listing not found" });
            }
            console.log(deletedListings);
            return res.status(200).json({ success: true, message: "Listing deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting listing", error: error.message });
        }
    });
    


    // app.delete("/listings/:id",async (req,res)=>{
    //     let{id}=req.params;
    //     let deletedListings = await Listing.findByIdAndDelete(id);
    //     console.log(deletedListings);
    //     // res.redirect("/listings")
    // })

    

// app.get("/testListing", async (req,res)=>{
//  let sampleListing = new Listing({
//     title: " my new villa",
//     description: " by th beach",
//     price: 1200,
//     location:"goa",
//     country : "india",

//  });
//  await sampleListing.save();
//  console.log("sample was saved");
//  res.send("successfull testing");
// });

app.listen(5050 ,() =>{
    console.log("server is listening to port 5050")
});