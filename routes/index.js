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
console.log(authorizeURL);

//views
router.get('/', (req, res) => res.render("landing"));

router.get('/home', async (req, res) => {
    try {
        //async requests
        let getMeResult = await spotifyApi.getMe();
        let getTopArtistsResult = await spotifyApi.getMyTopArtists({limit: 25});

        //sort top Artists by popularity
        artistSort(getTopArtistsResult.body.items);

        // res.send(getTopArtistsResult.body.items);
        res.render('home', {
            topArtists: getTopArtistsResult.body.items,
            name: getMeResult.body.display_name
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/mood', async (req, res) => {
    try {
        let result = await spotifyApi.getMe();
        console.log(result.body);
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
        console.log(result.body);
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
        console.log(result.body);
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