const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/",async(req,res)=>{
    let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`);
    response = await response.json();
    res.render("user/home",{topRated : response.results});
})

router.get("/movie/:id",async(req,res)=>{
    //search movie by id
    let response = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`);
    response = await response.json();

    //get videos of a movie by id using key
    let videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${process.env.TMDB_API_KEY}`)
    videoResponse = await videoResponse.json();

    //get movie reviews
    let reviewResponse = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}/reviews?api_key=${process.env.TMDB_API_KEY}`)
    reviewResponse = await reviewResponse.json();

    //get similar movies
    let similarResponse = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}/similar?api_key=${process.env.TMDB_API_KEY}`)
    similarResponse = await similarResponse.json();
    if(similarResponse.results.length<=8)
        res.render("user/movie",{movie:response,videos:videoResponse.results,reviews:reviewResponse.results,similarMovies:similarResponse.results});
    else{
        res.render("user/movie",{movie:response,videos:videoResponse.results,reviews:reviewResponse.results,similarMovies:similarResponse.results.slice(0,8)});
    }
})

router.get("/search",async(req,res)=>{
    const search = req.query.movie;
    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${search}`)
    response = await response.json();
    const results = await response.results.filter(movie=>movie.poster_path!=null);
    res.render("user/search",{results});
})

router.get("/movie/:id/videos",async(req,res)=>{
    let response = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${process.env.TMDB_API_KEY}`)
    response = await response.json();
    console.log("video---", response);
    res.render("user/videos",{videos:response.results});
})

module.exports = router;