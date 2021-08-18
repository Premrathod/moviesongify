const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contactNum: { type: String },
    favourites : [{
        movieId: {
            type : String,
            required : true,
        },
        imdbId : {
            type : String,
            required : true,
        }
    }],
    userType: { type: String, default: "STUDENT" },
    created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);
