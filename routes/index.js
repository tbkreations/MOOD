const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URL,
})

//views
router.get('/', (req, res) => res.render("landing"));
router.get('/home', (req, res) => res.render('home'));

router.get('/spotifyLogin', (req, res) => {
    let scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public','playlist-modify-private'];
    let authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    console.log(authorizeURL);
    res.redirect(authorizeURL + "&show_dialog=true");
})

router.get('/spotifyCallback', async (req, res) => {
    const { code } = req.query;
    console.log(code);
    try {
        let data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        res.redirect('/home');
    } catch (err) {
        res.redirect('/#/error/invalid token');
    }
})

module.exports = router;