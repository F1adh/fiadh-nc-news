const { fetchApiList, fetchTopics, fetchArticleById, fetchAllArticles, fetchArticleComments, checkArticleExists, insertComment, checkUserExists, updateArticleVotes, deleteComment, checkCommentExists } = require("../models/models")


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

exports.postComment = (req, res, next) =>{
    const {article_id} = req.params;
    const comment = req.body
    //check article exists
    //check user exists
    const doesArticleExist= checkArticleExists(article_id)
    const doesUserExist  = checkUserExists(comment.username)
   
    const addComment = insertComment(article_id, comment)

    return Promise.all([doesArticleExist, doesUserExist, addComment]).then((queryResponse)=>{
        const [,,newComment] = queryResponse;
        res.status(201).send(newComment)
    }).catch((err)=>{next(err)})
}

exports.patchArticle = (req, res, next) =>{
    const {article_id} = req.params;
    const {inc_votes} = req.body

    const doesArticleExist= checkArticleExists(article_id)
    const updatedVoteArticle = updateArticleVotes(article_id, inc_votes)

    return Promise.all([doesArticleExist, updatedVoteArticle]).then((queryResponse)=>{
        const [,newArticle] = queryResponse
        res.status(200).send(newArticle)
    }).catch((err)=>{next(err)})

}

exports.removeComment = (req, res, next) =>{
    const {comment_id} = req.params;

   console.log(typeof comment_id, "<<")
    const commentExists = checkCommentExists(comment_id)

    const commentDeleted = deleteComment(comment_id)

    return Promise.all([ commentExists, commentDeleted]).then((queryResponse)=>{
        res.status(204).send({})
    }).catch((err)=>{next(err)})
    
}