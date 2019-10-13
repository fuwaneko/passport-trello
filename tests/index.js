const expect = require('expect');
const nock = require('nock');
const request = require('supertest');

const passport = require('passport');
const express = require('express');

const { version, Strategy: TrelloStrategy } = require('../index');

describe("Trello authentication", () => {
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
    }));

    const app = express();
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login', passport.authenticate('trello'));

    it("Version match", () => {
        expect(version).toEqual('1.0.0');
    });

    it("Should make successfull authentication request", (done) => {
        nock('https://trello.com')
            .get('/1/OAuthGetRequestToken')
            .reply(200, {});
        request(app).get('/login').expect(200, done);
    });
});