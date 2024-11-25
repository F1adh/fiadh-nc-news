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
    return db.query(`SELECT * FROM topics`)
}