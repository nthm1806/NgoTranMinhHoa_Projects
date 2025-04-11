const Review = require('../models/ReviewModel');

const review = {
    addReview:async(form,cusID,categoryID)=>{
        const result = await Review.addReview(form,cusID,categoryID);
    },

    getReview:async(form)=>{
        const result = await Review.getReview(form);
        return result
    },

}

module.exports = review;