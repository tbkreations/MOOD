const express = require('express');
const router = express.Router();
const spotifyDataHelpers = require('../helpers/spotifyArrays');
const dotenv = require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

//Init Spotify API Object
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URL,
})

//Auth Scopes Dictionary
let scopes = ['user-read-private', 'user-library-read', 'user-library-modify', 'user-top-read', 'user-read-recently-played', 'user-read-playback-position', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-collaborative'];

//Create Spotify Auth URL
let authorizeURL = spotifyApi.createAuthorizeURL(scopes);

//views
router.get('/', (req, res) => res.render("landing"));

router.get('/home', async (req, res) => {
    try {
        //async requests
        let getMeResult = await spotifyApi.getMe();
        let getTopArtistsResult = await spotifyApi.getMyTopArtists({limit: 18});
        
        //artist array by affinity 0-10
        let topArtists = getTopArtistsResult.body.items;

        // res.send(topArtists);
        res.render('home', {
            topArtists: topArtists,
            name: getMeResult.body.display_name
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/mood', async (req, res) => {
    try {
        let result = await spotifyApi.getMe();

        res.render('mood', {
            name: result.body.display_name
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/artists', async (req, res) => {
    try {
        let result = await spotifyApi.getMe();
        res.render('artists', {
            name: result.body.display_name
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/songs', async (req, res) => {
    try {
        let result = await spotifyApi.getMe();
        res.render('songs', {
            name: result.body.display_name
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/spotifyLogin', (req, res) => {
    res.redirect(authorizeURL + "&show_dialog=true");
})

router.get('/spotifyCallback', async (req, res) => {
    const {
        code
    } = req.query || null;

    try {
        let data = await spotifyApi.authorizationCodeGrant(code);
        const {
            access_token,
            refresh_token
        } = data.body;

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        
        res.redirect('/home');
    } catch (err) {
        res.redirect('/#/error');
    }
})

module.exports = router;