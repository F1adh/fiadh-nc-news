const express = require('express');
const { getApi, getTopics, getArticleByID, getAllArticles } = require('./controllers/controllers');
const app = express();



app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleByID)

app.get('/api/articles', getAllArticles)

app.use((err, req, res, next)=>{
    
    if(err.msg === 'Resource not found'){
       
        res.status(404).send(err.msg)
    }
    
})

module.exports = app