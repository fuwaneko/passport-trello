const OAuthStrategy = require('passport-oauth1')

const defaultOptions = {
    requestTokenURL: 'https://trello.com/1/OAuthGetRequestToken',
    accessTokenURL: 'https://trello.com/1/OAuthGetAccessToken',
    userAuthorizationURL: 'https://trello.com/1/OAuthAuthorizeToken',
    profileURL: 'https://trello.com/1/members/me',
    sessionKey: 'oauth:trello',
}

class TrelloStrategy extends OAuthStrategy {
    name = 'trello'

    constructor(passedOptions, verify) {
        const options = Object.assign(defaultOptions, passedOptions || {})
        super(options, verify)
        this.options = options
    }

    userProfile(token, tokenSecret, params, done) {
        this._oauth.get(this.options.profileURL, token, tokenSecret, function (err, body, res) {
            if (err) {
                return done(new InternalOAuthError('failed to fetch user profile', err))
            }

            try {
                var json = JSON.parse(body)

                var profile = {
                    provider: 'trello'
                }
                profile.id = json.id
                profile.displayName = json.fullName
                profile.emails = [{
                    value: json.email,
                    type: 'work'
                }]

                profile._raw = body
                profile._json = json

                done(null, profile)
            } catch (e) {
                done(e)
            }
        })
    }

    userAuthorizationParams(passedOptions) {
        const options = Object.assign(this.options.trelloParams || {}, passedOptions || {})
        if (options.scope && Array.isArray(options.scope)) {
            options.scope = options.scope.join(',')
        }
        return options
    }
}

module.exports = {
    version: '1.0.0',
    Strategy: TrelloStrategy
}