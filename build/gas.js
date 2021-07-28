"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callAppsScript = callAppsScript;
exports.authorize = exports._auth = void 0;

var _googleapis = require("googleapis");

var _auth;

exports._auth = _auth;

var authorize = function authorize(_ref) {
  var credentials = _ref.credentials,
      token = _ref.token;
  var _credentials$installe = credentials.installed,
      client_secret = _credentials$installe.client_secret,
      client_id = _credentials$installe.client_id,
      redirect_uris = _credentials$installe.redirect_uris;
  var oAuth2Client = new _googleapis.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(token);
  exports._auth = _auth = oAuth2Client;
};

exports.authorize = authorize;

function callAppsScript(scriptId, functionName, parameters, callback) {
  var script = _googleapis.google.script({
    version: 'v1',
    auth: _auth
  });

  script.scripts.run({
    scriptId: scriptId,
    resource: {
      "function": functionName,
      parameters: parameters,
      devMode: true
    }
  }, function (err, res) {
    if (err) {
      console.log('The API returned an error: ' + err);
      callback(false, err);
      return;
    }

    if (res.error) {
      callback(false, res.error);
    } else {
      callback(true, res.data);
    }
  });
}