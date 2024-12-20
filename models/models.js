const db = require('../db/connection.js')
const fs = require('fs/promises')
const format = require('pg-format')

exports.fetchApiList = () =>{
    //read endpoints.json
    //ensure data parsed
    //return data
    return fs.readFile('endpoints.json', 'utf-8').then((fileData)=>{
        return JSON.parse(fileData);
    }  
    )
}

exports.fetchTopics = () =>{
    return db.query(`SELECT * FROM topics`).then((dbResponse)=>{return dbResponse.rows})
}

exports.fetchArticleById = (articleId) => {
    
    
    return db.query(`SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.author, articles.title, articles.body, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url;`, [articleId]).then((dbResponse)=>{ 
        
        if(dbResponse.rows.length===0){
            throw ({code:404, msg:'Not Found'})
        }
        else{
          return dbResponse.rows
        }
        })
        
}
//articles should be sorted by date in descending order
exports.fetchAllArticles = (sortBy = 'created_at', order='DESC', topic) =>{

    const validTopics = ['mitch', 'cats']
    const validSort = ['article_id', 'author', 'title', 'topic', 'created_at', 'votes', 'comment_count']
    const validOrder = ['ASC', 'DESC']
    let queryStr;
   

    if(!validSort.includes(sortBy) || !validOrder.includes(order)){
        return Promise.reject({code:400, msg:'Please provide a valid sort_by, order, or topic'})
    }
    else if(topic){
        if(!validTopics.includes(topic)){
            return Promise.reject({code:400, msg:'Please provide a valid sort_by, order, or topic'})
        }
    }
    

    const queryStrStart = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id`

    const queryStrEnd = ` GROUP BY articles.article_id, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url 
        ORDER BY %I %s;`

    if(topic){
        queryStr = format(queryStrStart + ` WHERE topic = %L` + queryStrEnd, topic, sortBy, order);
    }
    else{
        queryStr = format(queryStrStart + queryStrEnd, sortBy, order);
    }

   

    return db.query(queryStr).then((dbResponse)=>{ return dbResponse.rows}).catch((err)=>{console.log(err)})
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

exports.checkUserExists = (username) => {
    return db.query(`SELECT EXISTS (SELECT 1 FROM users WHERE username = $1);`, [username]).then((dbResponse)=>{
        const {exists} = dbResponse.rows[0]
      
        if(exists===false){
            
            return Promise.reject({code:404, msg:'Not Found'})
        }
        else{
            return Promise.resolve()
        }
    })
}

exports.insertComment = (articleId, comment) =>{
    
    const {username, body} = comment;
    const values = [articleId, username, body]
    const sql = format(`INSERT INTO comments (article_id, author, body) VALUES (%L) RETURNING *;`, values);
    
    return db.query(sql).then((dbResponse)=>{
        
        return dbResponse.rows[0].body
    })
}

exports.updateArticleVotes = (articleId, incVotes) =>{
      
    if(!incVotes || typeof incVotes !== 'number'){
        return Promise.reject({code: 400, msg:'Please include a vote integer'})
    }

    return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`, [articleId, incVotes])
    .then((dbResponse)=>{return dbResponse.rows[0]})
}



exports.checkCommentExists = (commentId) =>{
   
    if(isNaN(Number(commentId))){
         
        return Promise.reject({code: 400, msg:'Please provide integer for comment_id'})
    }
    else{
        
        return db.query(`SELECT EXISTS (SELECT 1 FROM comments WHERE comment_id = $1);`, [commentId]).then((dbResponse)=>{
            const {exists} = dbResponse.rows[0]
        

            if(exists===false){
            
           
                    return Promise.reject({code:404, msg:'Not Found'})
            
            
            }
            else{
                return Promise.resolve()
            }
        })
    }
}

exports.deleteComment = (commentId) =>{

    
    
        return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId]).then((dbResponse)=>{return dbResponse})
    
    
}

exports.fetchUsers = ()=>{
    return db.query(`SELECT * FROM users`).then((dbResponse)=>{return dbResponse.rows})
}