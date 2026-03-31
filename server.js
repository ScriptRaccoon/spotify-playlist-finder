// express
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.info(`Server running on port ${PORT}`)
})

// middleware for static files
app.use(express.static('public'))

// use view engine ejs
app.set('views', 'views')
app.set('view engine', 'ejs')

// various packages
const axios = require('axios')
const qs = require('qs')
require('dotenv').config({ quiet: true })

// main route
app.get('/', (_req, res) => {
	res.render('index')
})

// finder route
app.get('/finder', (req, res) => {
	if (req.query.access_token) {
		res.render('finder', { query: req.query })
	} else {
		res.send(`Error: No access token provided`)
	}
})

// spotify authorization
app.get('/authorize', (_req, res) => {
	const scopes = 'playlist-read-private playlist-read-collaborative'
	res.redirect(
		'https://accounts.spotify.com/authorize?response_type=code' +
			`&client_id=${process.env.CLIENT_ID}` +
			`&scope=${encodeURIComponent(scopes)}` +
			`&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`,
	)
})

// callback after authorization and get access token
app.get('/callback', async (req, res) => {
	if (req.query.error) {
		res.send(`Error: ${req.query.error}`)
		return
	}
	if (!req.query.code) {
		res.send(`Error: No code provided`)
		res.end()
		return
	}
	const url = 'https://accounts.spotify.com/api/token'
	const headers = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		auth: {
			username: process.env.CLIENT_ID,
			password: process.env.CLIENT_SECRET,
		},
	}
	const body = qs.stringify({
		grant_type: 'authorization_code',
		code: req.query.code,
		redirect_uri: process.env.REDIRECT_URI,
	})
	try {
		const response = await axios.post(url, body, headers)
		if (response.status == 200) {
			const { access_token, expires_in } = response['data']
			const expire_time = new Date().getTime() + parseInt(expires_in) * 1000
			res.redirect(
				`/finder?access_token=${access_token}&expire_time=${expire_time}`,
			)
		} else {
			res.send(`Error: ${response.status}`)
		}
	} catch (err) {
		res.send(`Error: ${err.message}`)
	}
})

// get a new access token (not needed right now)
app.get('/newtoken', async (req, res) => {
	const refresh_token = req.query.token
	if (!refresh_token) {
		res.redirect('/')
		return
	}
	const url = 'https://accounts.spotify.com/api/token'
	const headers = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		auth: {
			username: process.env.CLIENT_ID,
			password: process.env.CLIENT_SECRET,
		},
	}
	const body = qs.stringify({
		grant_type: 'refresh_token',
		refresh_token,
	})
	try {
		const response = await axios.post(url, body, headers)
		if (response.status == 200) {
			const { access_token, refresh_token } = response['data']
			if (refresh_token) {
				res.redirect(
					`/finder.html?access_token=${access_token}&refresh_token=${refresh_token}`,
				)
			} else {
				res.redirect(`/finder.html?access_token=${access_token}`)
			}
		} else {
			res.send(`Error: ${response.status}`)
		}
	} catch (err) {
		res.send(`Error: ${err.message}`)
	}
})
