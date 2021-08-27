const fetch = require("node-fetch");
const clientId = process.env.SPOTIFY_API_ID;
const clientSecret = process.env.SPOTIFY_API_SECRET;
const SpotifyWebApi = require("spotify-web-api-node");

var access_token;

// spotify API configuration
var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_API_ID,
	clientSecret: process.env.SPOTIFY_API_SECRET,
	redirectUri: "http://localhost:3000/",
});

const _getToken = async () => {
	const result = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
		},
		body: "grant_type=client_credentials",
	});

	const data = await result.json();
	return data.access_token;
};

_getToken().then((res) => {
	access_token = res;
});

spotifyApi.setAccessToken(access_token);

const _getGenres = async () => {
	const result = await fetch(
		`https://api.spotify.com/v1/browse/categories?locale=sv_US`,
		{
			method: "GET",
			headers: { Authorization: "Bearer " + access_token },
		}
	);
	const data = await result.json();
	console.log("ID:", clientId);
	console.log("Secret:", clientSecret);
	console.log("data:", data);
	console.log("access_token:", access_token);
	return data.categories.items;
};

const _getPlaylistByGenre = async (genreId) => {
	const limit = 10;

	const result = await fetch(
		`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
		{
			method: "GET",
			headers: { Authorization: "Bearer " + access_token },
		}
	);

	const data = await result.json();
	return data.playlists.items;
};

const _getTracks = async (tracksEndPoint) => {
	const limit = 10;

	const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
		method: "GET",
		headers: { Authorization: "Bearer " + access_token },
	});

	const data = await result.json();
	return data.items;
};

const _getTrack = async (trackEndPoint) => {
	const result = await fetch(`${trackEndPoint}`, {
		method: "GET",
		headers: { Authorization: "Bearer " + access_token },
	});

	const data = await result.json();
	return data;
};

module.exports = {
	access_token,
	_getToken,
	_getGenres,
	_getPlaylistByGenre,
	_getTrack,
	_getTracks,
};
