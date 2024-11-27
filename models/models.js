const db = require('../db/connection.js')
const fs = require('fs/promises')

exports.fetchApiList = () =>{
    //read endpoints.json
    //ensure data parsed
    //return data
    return fs.readFile('endpoints.json', 'utf-8').then((fileData)=>{
        return JSON.parse(fileData)
    }  
    )
}

exports.fetchTopics = () =>{
    return db.query(`SELECT * FROM topics`).then((dbResponse)=>{return dbResponse.rows})
}

exports.fetchArticleById = (articleId) => {
    
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId]).then((dbResponse)=>{ 
        
        if(dbResponse.rows.length===0){
            throw ({code:404, msg:'Not Found'})
        }
        else{
          return dbResponse.rows[0]  
        }
        })
        
}

exports.fetchAllArticles = () =>{
    return db.query(`SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
ORDER BY articles.created_at DESC;`).then((dbResponse)=>{ return dbResponse.rows})
}

exports.checkArticleExists = (articleId) =>{
    return db.query(`SELECT EXISTS (SELECT 1 FROM articles WHERE article_id = $1);`, [articleId]).then((dbResponse)=>{
        const {exists} = dbResponse.rows[0]
      
        if(exists===false){
            
            return Promise.reject({code:404, msg:'Not Found'})
        }
        else{
            return Promise.resolve()
        }
    })
    
}

exports.fetchArticleComments = (articleId) =>{
    return db.query(`SELECT * FROM comments WHERE article_id = $1
        ORDER BY created_at DESC;`, [articleId]).then((dbResponse)=>{
                   
            return dbResponse.rows
           
            
        })
}