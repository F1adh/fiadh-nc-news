const { fetchApiList, fetchTopics } = require("../models/models")


exports.getApi = (req, res, next) =>{
    
    return fetchApiList().then((dataObject)=>{
        
        res.status(200).send({endpoints: dataObject})
    })
}

exports.getTopics = (req, res, next) =>{
    return fetchTopics().then((queryResponse)=>{
        res.status(200).send({topics: queryResponse.rows})
    })
}