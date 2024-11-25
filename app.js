const express = require('express');
const { getApi, getTopics } = require('./controllers/controllers');
const app = express();
app.use(express.json());


app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.use((err, req, res, next)=>{
    //error handling here
})

module.exports = app