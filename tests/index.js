const assert = require('assert')
const nock = require('nock')
const request = require('supertest')

const passport = require('passport')
const express = require('express')
const session = require('express-session')

const { version, Strategy: TrelloStrategy } = require('../index')

const mockToken = {
    oauth_token: 'token',
    oauth_token_secret: 'token-secret',
}
const mockProfile = {
    id: 1,
    fullName: 'mock mocking',
    email: 'mock@mock.com',
}

describe('Trello authentication', () => {
    passport.use(new TrelloStrategy({
        consumerKey: 'key',
        consumerSecret: 'secret',
        callbackURL: 'cb',
        passReqToCallback: true,
    }, (req, token, tokenSecret, profile, done) => {
        if (!req.user) {

        }
        else {

        }
    }))

    const app = express()
    app.use(session({ secret: 'trello-test', resave: false, saveUninitialized: false }))
    app.use(passport.initialize())
    app.use(passport.session())

    app.get('/login', passport.authenticate('trello'))

    it('Version match', () => {
        assert.equal(version, '1.0.0')
    })

    it('Should make successfull authentication request', (done) => {
        nock('https://trello.com')
            .post('/1/OAuthGetRequestToken')
            .reply(200, mockToken)
            .post('/1/OAuthGetAccessToken')
            .reply(200, {})
            .post('/1/OAuthAuthorizeToken')
            .reply(200, {})
            .get('/members/me')
            .reply(200, mockProfile)
        
        request(app).get('/login').end(function(err, res) {
            assert.equal(err, null)
            done()
        })
    })
})