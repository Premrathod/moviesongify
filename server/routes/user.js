const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/",async(req,res)=>{
    let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`);
    response = await response.json();
    res.render("user/home",{topRated : response.results});
})

router.get("/movie/:id",async(req,res)=>{
    let response = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`);
    response = await response.json();
    console.log(response);
    res.render("user/movie",{movie:response});
})

module.exports = router;