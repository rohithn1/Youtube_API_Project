const express = require('express');
const cors = require('cors');
const keys = require('./keys');
const app = express();
const request = require('request');
const getJSON = require('get-json');
const key = keys.APIKey;

const chanID = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&fields=items%2Fsnippet%2FchannelId&format=json&key='+key+'&q=' //url to get channel id via name
var chanVids = 'https://www.googleapis.com/youtube/v3/search?key='+key+'&part=snippet,id&order=date&maxResults=' //getting the channels newest 20 videos
var chanVids1 = '&format=json&channelId='
const chanVids2 = '&q=' //this parameter is defined if the client requests a key phrase
app.use(cors())

/*
1. install all dependencies (found in package.json)
2. run the command 'npm start' => API will listen on localhost port 8080
3. go to the url: http://localhost:8080/api/channel for default response
4. Add in 1 of 3 parameters to specify response 
    > maxResults={number of desired videos}
    > channel={channel name}
    > keyPhrase={key phrase to filter videos by}
*/

app.get('/api/channel', (req,response) => {
    console.log(req.query)
    let keyPhrase = '';
    let results = 12;
    let chanName = 'MKBHD'; //the channel which will be queryed is defaulted to MKBHD
    if (req.query.maxResults) {
        results = req.query.maxResults; //the maxResults will default to 12 videos if not specified in the request
    } 
    if (req.query.channel) {
        chanName = req.query.channel; //if a channel is specified in the request it will override the default channel
    }
    if (req.query.keyPhrase) {
        keyPhrase = req.query.keyPhrase;
    }
    getJSON(chanID+chanName, (res) => { //get request to Youtube with the query string as 'MKBHD', the default youtube channel
    })
    .then((res) => {
        let ID = res.items[0].snippet.channelId;
        getJSON(chanVids+results+chanVids1+ID+chanVids2+keyPhrase, (res) => { //get request to Youtube where the Channel data is exchanged for ChannelID
        })
        .then((data) => {
            response.send(data.items); //server responds with video data which will be formatted and processed on client side
        })
    })
})


app.listen(8080, () => {
    console.log('listening on port 8080');
})