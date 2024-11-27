const { fetchApiList, fetchTopics, fetchArticleById, fetchAllArticles, fetchArticleComments, checkArticleExists } = require("../models/models")


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
        res.status(200).send({articles: queryResponse})
    })
}

exports.getArticleComments = (req, res, next) =>{
   const doesArticleExist= checkArticleExists(req.params.article_id)

   const retrieveComments = fetchArticleComments(req.params.article_id)
  

   return Promise.all([doesArticleExist, retrieveComments]).then((queryResponse)=>{
        const [,comments] = queryResponse
        
        if(comments.length === 0){
            res.status(200).send({msg: 'No Comments'})
        }
        else{
            res.status(200).send({comments})
        }
   }).catch((err)=>{
    next(err)
   })
   
   
}