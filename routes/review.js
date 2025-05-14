const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js")
const Listing = require("../models/Listing.js");

//middleware
const validateReview = (req, res, next) => {
      let {error} =  reviewSchema.validate(req.body);
      if (error) {
             let msg = result.error.details.map(el => el.message).join(',');
            throw new ExpressError(400, msg);
      } else {
            next();
      }
};
//Post Route
router.post("/",validateReview, wrapAsync(async(req,res)=>{
      let listing = await Listing.findById(req.params.id); 
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      console.log("new review saved");
      res.redirect(`/listing/${listing._id}`);
}))
// Delete review route
router.delete("/:revid",wrapAsync(async(req,res)=>{
       let {id , revid} = req.params;
       await Listing.findByIdAndUpdate(id,{$pull:{reviews:revid}});
       await Review.findByIdAndDelete(revid);
 
       res.redirect(`/listing/${id}`);
 }));
 
module.exports = router;