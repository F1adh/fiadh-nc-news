const express = require('express');
const { getApi, getTopics, getArticleByID, getAllArticles, getArticleComments, postComment, patchArticle, removeComment, getUsers } = require('./controllers/controllers');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleByID)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', removeComment)

app.get('/api/users', getUsers)

app.use((err, req, res, next)=>{
    
        res.status(err.code).send(err.msg)
    
    
})


module.exports = app