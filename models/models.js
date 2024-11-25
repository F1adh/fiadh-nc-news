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
            throw ({code:404, msg:'Resource not found'})
        }
        else{
          return dbResponse.rows[0]  
        }
        })
        
}