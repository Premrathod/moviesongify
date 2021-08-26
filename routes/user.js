const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyHelperFunctions = require("../utils/spotifyHelperFunctions");

// spotify API configuration
var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_API_ID,
	clientSecret: process.env.SPOTIFY_API_SECRET,
	redirectUri: "http://localhost:3000/",
});

// const access_token = spotifyHelperFunctions._access_token();
// console.log("-------", access_token);

// spotifyApi.setAccessToken(access_token);

router.get("/spotify", async (req, res) => {
	const genres = await spotifyHelperFunctions._getGenres();
	res.render("user/spotifyGenres", { genres });
});

router.get("/spotify/genres/:id", async (req, res) => {
	const playlists = await spotifyHelperFunctions._getPlaylistByGenre(
		req.params.id
	);
	// console.log(playlists);
	res.render("user/spotifyGenreId", { playlists });
});

router.get("/spotify/genres/:id/tracks", async (req, res) => {
	const tracks = await spotifyHelperFunctions._getTracks(
		`https://api.spotify.com/v1/playlists/${req.params.id}/tracks`
	);
	// console.log(tracks[0].track.album.images);
	res.render("user/spotifyTracks", { tracks, playlistId: req.params.id });
});

router.get("/spotify/genres/:id/tracks/:trackId/track", async (req, res) => {
	const track = await spotifyHelperFunctions._getTrack(
		`https://api.spotify.com/v1/tracks/${req.params.trackId}`
	);
	console.log(track);
	res.redirect("back");
	// res.render("user/spotifyGenreId", { tracks });
});

router.get("/", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	res.render("user/home", { topRated: response.results });
});

// get info about particular movie -------------------------
router.get("/movie/:id", async (req, res) => {
	//search movie by id
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let imdb_id = await response.imdb_id;

	let imdbDetails = await fetch(
		"https://moviesongifyflaskapi.herokuapp.com/imdbDetails",
		{
			method: "POST",
			body: JSON.stringify({
				imdb_id: imdb_id,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	imdbDetails = await imdbDetails.json();
	console.log("imdb ka details yaha hai ---", imdbDetails);

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

	let type = "Movie";

	if (similarResponse.results.length <= 8)
		res.render("user/movie", {
			type,
			movie: response,
			videos: videoResponse.results,
			reviews: reviewResponse.results,
			similarMovies: similarResponse.results,
			imdbDetails,
		});
	else {
		res.render("user/movie", {
			type,
			movie: response,
			videos: videoResponse.results,
			reviews: reviewResponse.results,
			similarMovies: similarResponse.results.slice(0, 8),
			imdbDetails,
		});
	}
});

// get info about particular TV Show -------------------------
router.get("/tvshow/:id", async (req, res) => {
	//search TV Show by id
	console.log("aya mc");
	let response = await fetch(
		`https://api.themoviedb.org/3/tv/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();

	let external_ids = await fetch(
		`https://api.themoviedb.org/3/tv/${req.params.id}/external_ids?api_key=${process.env.TMDB_API_KEY}`
	);
	external_ids = await external_ids.json();
	const imdb_id = external_ids.imdb_id;

	let imdbDetails = await fetch(
		"https://moviesongifyflaskapi.herokuapp.com/imdbDetails",
		{
			method: "POST",
			body: JSON.stringify({
				imdb_id: imdb_id,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	imdbDetails = await imdbDetails.json();
	console.log("imdb ka details yaha hai ---", imdbDetails);

	//get videos of a TV Show by id using key
	let videoResponse = await fetch(
		`https://api.themoviedb.org/3/tv/${req.params.id}/videos?api_key=${process.env.TMDB_API_KEY}`
	);
	videoResponse = await videoResponse.json();

	//get TV Show reviews
	let reviewResponse = await fetch(
		`https://api.themoviedb.org/3/tv/${req.params.id}/reviews?api_key=${process.env.TMDB_API_KEY}`
	);
	reviewResponse = await reviewResponse.json();

	//get similar TV Shows
	let similarResponse = await fetch(
		`https://api.themoviedb.org/3/tv/${req.params.id}/similar?api_key=${process.env.TMDB_API_KEY}`
	);
	similarResponse = await similarResponse.json();

	let type = "TV";

	if (similarResponse.results.length <= 8)
		res.render("user/movie", {
			type,
			movie: response,
			videos: videoResponse.results,
			reviews: reviewResponse.results,
			similarMovies: similarResponse.results,
			imdbDetails,
		});
	else {
		res.render("user/movie", {
			type,
			movie: response,
			videos: videoResponse.results,
			reviews: reviewResponse.results,
			similarMovies: similarResponse.results.slice(0, 8),
			imdbDetails,
		});
	}
});

router.get("/search", async (req, res) => {
	const search = req.query.movie;
	let response = await fetch(
		`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${search}`
	);
	response = await response.json();
	// console.log(response);
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

// Movie Filters routes starts here -----------------------------------------------------------
router.get("/movies/topRated", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(movie) => movie.poster_path != null
	);
	let filterType = "Top Rated",
		type = "Movie";
	res.render("user/filters", { results, filterType, type });
});

router.get("/movies/nowPlaying", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(movie) => movie.poster_path != null
	);
	let filterType = "Now Playing",
		type = "Movie";
	res.render("user/filters", { results, filterType, type });
});

router.get("/movies/popular", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(movie) => movie.poster_path != null
	);
	let filterType = "Popular",
		type = "Movie";
	res.render("user/filters", { results, filterType, type });
});

router.get("/movies/latest", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/latest?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	let filterType = "Latest",
		type = "Movie";
	let results = [];
	if (response.poster_path != null) {
		results.push(response);
		res.render("user/filters", { results, filterType, type });
	} else {
		res.render("user/filters", { results, filterType, type });
	}
});

router.get("/movies/upcoming", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(movie) => movie.poster_path != null
	);
	let filterType = "Upcoming",
		type = "Movie";
	res.render("user/filters", { results, filterType, type });
});
//Filters routes end -----------------------------------------------------------

// TV Filters routes starts here -----------------------------------------------------------
router.get("/tv/airingToday", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(tv) => tv.poster_path != null
	);
	let filterType = "Airing Today",
		type = "TV";
	res.render("user/filters", { results, filterType, type });
});

router.get("/tv/onTheAir", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(tv) => tv.poster_path != null
	);
	let filterType = "On The Air",
		type = "TV";
	res.render("user/filters", { results, filterType, type });
});

router.get("/tv/popular", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(tv) => tv.poster_path != null
	);
	let filterType = "Popular",
		type = "TV";
	res.render("user/filters", { results, filterType, type });
});

router.get("/tv/topRated", async (req, res) => {
	let response = await fetch(
		`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_API_KEY}`
	);
	response = await response.json();
	const results = await response.results.filter(
		(tv) => tv.poster_path != null
	);
	let filterType = "Top Rated",
		type = "TV";
	res.render("user/filters", { results, filterType, type });
});
// TV Filters routes end -----------------------------------------------------------

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
