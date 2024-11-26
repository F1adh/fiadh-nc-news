const { fetchApiList, fetchTopics, fetchArticleById, fetchAllArticles } = require("../models/models")


exports.getApi = (req, res, next) =>{
    
    return fetchApiList().then((dataObject)=>{
        
        res.status(200).send({endpoints: dataObject})
    })
}

exports.getTopics = (req, res, next) =>{
    return fetchTopics().then((queryResponse)=>{
        res.status(200).send({topics: queryResponse})
    })
}

exports.getArticleByID = (req, res, next) =>{
    
    return fetchArticleById(req.params.article_id).then((queryResponse)=>{
        res.status(200).send({article: queryResponse})
    }).catch((err)=>{
      
        next(err)
    })
}

exports.getAllArticles = (req, res, next) =>{
    return fetchAllArticles().then((queryResponse)=>{
        console.log(queryResponse)
        res.status(200).send({articles: queryResponse})
    })
}