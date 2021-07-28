const { google } = require('googleapis');

var _auth;

const authorize = ({credentials, token}) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(token);
  _auth = oAuth2Client;
};

function callAppsScript(scriptId, functionName, parameters, callback) {
  const script = google.script({ version: 'v1', _auth });

  script.scripts.run(
    {
      scriptId,
      resource: {
        function: functionName,
        parameters,
        devMode: true,
      },
    },
    (err, res) => {
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
    }
  );
}

export { _auth, authorize, callAppsScript };
