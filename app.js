const express = require("express");
const ejs =require("ejs");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const Listing = require("./models/Listing.js");
const app = express();
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const methodOverride = require('method-override');
const listings = require("./routes/listing.js");
const  reviews = require("./routes/review.js");

app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.engine('ejs', ejsMate);
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));


//connecting with database
const db_url ="mongodb://127.0.0.1:27017/wonderlust";
async function main() {
      await mongoose.connect(db_url);
}
main().then(()=>{console.log("connected to database")})
      .catch((error)=>{console.log(error)});


// working with routs
app.use("/listing",listings)
app.use("/listing/:id/reviews", reviews);

app.get("/",(req,res)=>{
      res.send("working fine");
})
app.all("*",(req,res,next)=>{
      next(new ExpressError(401,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
      let{statuscode =500,message="Some thing went wrong"} =err;
      res.status(statuscode).render("listings/error.ejs",{err});
      
})
app.listen(8081,()=>{
      console.log("server is listerning to port 8081");
})



























// app.get("/listingCheak", async(req,res)=>{

//       let testListing = new Listing({
//             title:"villa",
//             description:"enjoy your holidays",
//             price:20000,
//             location:"goa",
//             country:"india",
//       });
//       await testListing.save();
//       console.log("Sample was saved ");
//       res.send("Successful testing");
// })
