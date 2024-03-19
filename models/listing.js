const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String, // Fixed typo in "description"
    image: {
        type:String,
        // default: "https://pixabay.com/photos/tree-sunset-clouds-sky-silhouette-736885/"
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
