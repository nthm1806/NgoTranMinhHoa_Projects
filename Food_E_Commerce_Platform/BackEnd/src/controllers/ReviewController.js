const Review = require('../services/ReviewService');

const review={
    addReview: async(req,res)=>{
        try {
            const form = req.body.formReview;
            const cusID = req.body.cusID;
            const categoryID = req.body.categoryID
            await Review.addReview(form,cusID,categoryID);
            res.status(200).json("succes");
        } catch (error) {
            console.log(error)
        }
    },
    addReviewProduct: async(req,res)=>{
        try {
            const {formReview,cusID,categoryID} = req.body;
            await Review.addReviewProduct(formReview,cusID,categoryID)
        } catch (error) {
            console.log(error)
        }
    },
    getReview: async(req,res)=>{
        try {
            const rs =  await Review.getReview(req.body.form);
            res.status(200).json(rs)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = review;