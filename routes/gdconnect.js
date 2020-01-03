const fs = require('fs');
const readline = require('readline');
const express = require('express');
const async = require('async');
const {
    google
} = require('googleapis');

const searchFile = {
    id = null,
    name = null
}

const router = express.Router();
var arr_Files;
var index;
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.


function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });

}


function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function listFiles(auth) {
    const drive = google.drive({
        version: 'v3',
        auth
    });
    arr_Files = [];
    index = 0;
    loopingHardstyle(null);
    function loopingHardstyle(page){
        drive.files.list({
            pageToken: page,
            q: "mimeType='text/plain'",
            pageSize: 100,
            fields: 'nextPageToken, files(id, name)',
        }, (err, res) => {
            if(err){    
                console.error(err);
                return err;
            }
            else{
                console.log("Loading page: "+index);
                res.data.files.map((file) =>{
                    arr_Files.push({
                        id: file.id,
                        index: index,
                        filename: file.name
                    });
                    index++;
                });
                if(res.data.nextPageToken != undefined){
                    pageToken = res.data.nextPageToken;
                    loopingHardstyle(pageToken);
                }
                else{
                    return;
                }
            }
        });
    }

}

router.get('/', function (req, res, next) {
    if(arr_Files == null || arr_Files.length == 0){
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            authorize(JSON.parse(content), listFiles);
        });
    }
    res.status(200).json({
        data: JSON.stringify(arr_Files)
    });
});

router.post('/search',function(req,res){
    searchFile.id = req.body.id;
    searchFile.name = req.body.name;
});

router.get('/searchResult', function (req, res, next) {
    
    res.status(200).json({
        data: [
            { id: searchFile.id, name: searchFile.name}
        ]
    });
});

module.exports = router;