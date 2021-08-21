const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

var SpotifyWebApi = require("spotify-web-api-node");

// spotify API configuration
var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_API_ID,
	clientSecret: process.env.SPOTIFY_API_SECRET,
	redirectUri: "http://localhost:3000/",
});

router.get("/", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	res.render("user/home", { topRated: response.results });
});

router.get("/movie/:id", async (req, res) => {
	//search movie by id
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();

	//get videos of a movie by id using key
	let videoResponse = await fetch(
		`https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${process.env.TMDB_API_KEY}`
	);
	videoResponse = await videoResponse.json();

	//get movie reviews
	let reviewResponse = await fetch(
		`https://api.themoviedb.org/3/movie/${req.params.id}/reviews?api_key=${process.env.TMDB_API_KEY}`
	);
	reviewResponse = await reviewResponse.json();

	//get similar movies
	let similarResponse = await fetch(
		`https://api.themoviedb.org/3/movie/${req.params.id}/similar?api_key=${process.env.TMDB_API_KEY}`
	);
	similarResponse = await similarResponse.json();
	if (similarResponse.results.length <= 8)
		res.render("user/movie", {
			movie: response,
			videos: videoResponse.results,
			reviews: reviewResponse.results,
			similarMovies: similarResponse.results,
		});
	else {
		res.render("user/movie", {
			movie: response,
			videos: videoResponse.results,
			reviews: reviewResponse.results,
			similarMovies: similarResponse.results.slice(0, 8),
		});
	}
});

router.get("/search", async (req, res) => {
	const search = req.query.movie;
	let response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${search}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(movie) => movie.poster_path != null
	);
	res.render("user/search", { results, genre: "", search });
});

router.get("/movie/:id/videos", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	console.log("video---", response);
	res.render("user/videos", { videos: response.results });
});

// Filters routes starts here -----------------------------------------------------------
router.get("/movies/topRated", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let filterType = "Top Rated",
		type = "Movie";
	res.render("user/filters", { results: response.results, filterType, type });
});

router.get("/movies/nowPlaying", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let filterType = "Now Playing",
		type = "Movie";
	res.render("user/filters", { results: response.results, filterType, type });
});

router.get("/movies/popular", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let filterType = "Popular",
		type = "Movie";
	res.render("user/filters", { results: response.results, filterType, type });
});

router.get("/movies/latest", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/latest?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let filterType = "Latest",
		type = "Movie";
	res.render("user/latest", { topRated: response.results, filterType, type });
});

router.get("/movies/upcoming", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let filterType = "Upcoming",
		type = "Movie";
	res.render("user/filters", { results: response.results, filterType, type });
});
//Filters routes end -----------------------------------------------------------

//Genres routes start -----------------------------------------------------------
router.get("/movies/genres", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let type = "Movie";
	res.render("user/genres", { genres: response.genres, type });
});

router.get("/movie/genres/:genre/:genreId", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${req.params.genreId}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(movie) => movie.poster_path != null
	);
	let type = "Movie";
	res.render("user/search", { results, genre: req.params.genre, type });
});

router.get("/tv/genres", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let type = "TV";
	res.render("user/genres", { genres: response.genres, type });
});

router.get("/tv/genres/:genre/:genreId", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${req.params.genreId}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(movie) => movie.poster_path != null
	);
	let type = "TV";
	res.render("user/search", { results, genre: req.params.genre, type });
});
//Genres routes end -----------------------------------------------------------

router.get("/test", (req, res) => {});

module.exports = router;
