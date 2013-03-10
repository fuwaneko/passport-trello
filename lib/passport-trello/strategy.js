/**
 * Module dependencies.
 */
var util = require('util')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy;


/**
 * `Strategy` constructor.
 *
 * The Flickr authentication strategy authenticates requests by delegating to
 * Flick using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Flickr
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Flickr will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new FlickrStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/flickr/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || "https://trello.com/1/OAuthGetRequestToken";
  options.accessTokenURL = options.accessTokenURL || "https://trello.com/1/OAuthGetAccessToken";
  options.userAuthorizationURL = options.userAuthorizationURL || "https://trello.com/1/OAuthAuthorizeToken";
  options.sessionKey = options.sessionKey || 'oauth:trello';

  OAuthStrategy.call(this, options, verify);
  this.name = 'trello';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Flickr.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id (Flickr user_nsid)`
 *   - `username`
 *   - `fullyName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.getProtectedResource('https://trello.com/1/members/me', token, tokenSecret, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'trello' };
      profile.id = json.id;
      profile.displayName = json.fullName;
      profile.emails = [{
        value: json.email,
        type: 'work'
      }];
      
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
