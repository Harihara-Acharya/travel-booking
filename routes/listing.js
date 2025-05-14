const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/wrapAsync.js");
const {listingSchema ,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/Listing.js");


//middleware
const validateListing = (req, res, next) => {
      let {error} =  listingSchema.validate(req.body);
      if (error) {
             let msg = result.error.details.map(el => el.message).join(',');
            throw new ExpressError(400, msg);
      } else {
            next();
      }
};

//index route
router.get("/",warpAsync( async (req,res)=>{
      let allListings = await Listing.find({});
      res.render("listings/index.ejs",{allListings});


}));
//new route
router.get("/new",(req,res)=>{
      res.render("listings/add.ejs");
})
//show route
router.get("/:id",warpAsync (async(req,res)=>{
      let {id} = req.params; 
      let data = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs",{data});
}));

//Create Route
router.post("/", validateListing, warpAsync(async (req, res, next) => {   
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listing");
})); 
//edit route
router.get("/:id/edit",warpAsync( async(req,res)=>{
      let {id} =req.params;
      let data = await Listing.findById(id);
      res.render("listings/edit.ejs",{data});
}));
//update route
router.put("/:id", validateListing, warpAsync(async (req, res) => {
      const { id } = req.params;
      const lsdata = req.body.listing;
      await Listing.findByIdAndUpdate(id, { ...lsdata });
      res.redirect(`/listing/${id}`);
}));
//delete rout
router.delete(" /:id",warpAsync (async(req,res)=>{
      let {id} = req.params;
      await Listing.findByIdAndDelete(id);
      res.redirect("/listing");     
}));

module.exports = router;