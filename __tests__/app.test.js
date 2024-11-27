const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/')
require('jest-sorted')

beforeEach(() => seed(data));
afterAll(() => db.end());
/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", ()=>{
  test("200: Responds with an array of topic objects, containing all database topic records", ()=>{
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body: {topics}})=>{
      expect(topics).toEqual([
        {
          description: 'The man, the Mitch, the legend',
          slug: 'mitch'
        },
        {
          description: 'Not dogs',
          slug: 'cats'
        },
        {
          description: 'what books are made of',
          slug: 'paper'
        }
      ])
    })
  })
  
  
})
describe("General errors", ()=>{
  test("404: Responds with empty object when request is made to non-existing endpoint", ()=>{
    return request(app)
    .get('/idontexist')
    .expect(404)
    .then(({body})=>{
      expect(body).toEqual({})
    })
  })
})

describe("GET /api/articles/:article_id", ()=>{
  test("200: responds with an article object with correct properties", ()=>{
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body:{article}})=>{
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
    })
  })
  test("404: responds with 'Resource not found' if there are no matches for article ID", ()=>{
    return request(app)
    .get('/api/articles/100')
    .expect(404)
    .then(({text})=>{
     
      expect(text).toBe('Not Found')
    })
  })
  /*
  test("404: responds with 'Not Found' if ID is missing", ()=>{
    return request(app)
    .get('/api/articles/')
    .expect(404)
    //I don't know how to handle 404 when it's provided by express so yeah
  })
  well I can't use this test now, will look at alternative e.g. string instead of number
  */ 
})

describe("GET /api/articles", ()=>{
  test("200: Responds with array of article objects with required properties", ()=>{
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body: {articles}})=>{
      articles.forEach((article)=>{
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String)
        })
      })
    })
  })
  test("200: articles sorted by date in descending order", ()=>{
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body: {articles}})=>{
      expect(articles).toBeSortedBy('created_at', { descending: true})
    })
  })
  test("200: articles do not have a body property", ()=>{
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body: {articles}})=>{
      articles.forEach((article)=>{
        expect(article).not.toHaveProperty('body')
        
      })
    })
  })
})
describe("GET /api/articles/:article_id/comments", ()=>{
  test("200: retrieves comments for given article_id with required properties", ()=>{
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body: {comments}})=>{
      comments.forEach((comment)=>{
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String)
        })
      })
    })
  })
  test("200: comments should be ordered by date in descending order", ()=>{
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body: {comments}})=>{
      expect(comments).toBeSortedBy('created_at', {descending:true})
    })
  })
  test("404: returns 'Not Found' for article_id without corresponding records ",()=>{
    return request(app)
    .get('/api/articles/1337/comments')
    .expect(404)
    .then(({text})=>{
      expect(text).toBe('Not Found')
    })
  })
  test("200: returns 'No Comments' for article_id with no corresponding comments", ()=>{ //200
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then(({body:{msg}})=>{
      expect(msg).toBe('No Comments')
    })
  })
})
describe("POST /api/articles/:article_id/comments", ()=>{
  test("201: Add a comment for given article_id", ()=>{
    const testBody = {username: 'icellusedkars', body: 'Primus sucks'}
    return request(app)
    .post('/api/articles/1/comments')
    .send(testBody)
    .expect(201)
    .then(({text})=>{
      expect(text).toBe('Primus sucks')
    })
  })

  test("404: returns 'Not Found' if article_id doesn't exist", ()=>{
    const testBody = {username: 'icellusedkars', body: 'Primus sucks'}
    return request(app)
    .post('/api/articles/1337/comments')
    .send(testBody)
    .expect(404)
    .then(({text})=>{
      expect(text).toBe('Not Found')
    })
  })
  test("404: returns 'Not Found' if author doesn't exist", ()=>{
    const testBody = {username: 'deceptacon', body: 'Who took the ram from the ramalamadingdong?'}
    return request(app)
    .post('/api/articles/1/comments')
    .send(testBody)
    .expect(404)
    .then(({text})=>{
      expect(text).toBe('Not Found')
    })
  })
})
describe("PATCH /api/articles/:article_id", ()=>{
  test("200: increases votes by 1 for article corresponding with article_id, returning the updated article", ()=>{
    const testBody = {inc_votes: 1};
    return request(app)
    .patch('/api/articles/1')
    .send(testBody)
    .expect(200)
    .then(({body})=>{
      expect(body).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("200: decreases votes by 100 for article corresponding with article_id, returning the updated article", ()=>{
    const testBody = {inc_votes: -100};
    return request(app)
    .patch('/api/articles/1')
    .send(testBody)
    .expect(200)
    .then(({body})=>{
      expect(body).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    })
  })
  test("404: returns 'Not Found' if article_id doesn't exist", ()=>{
    const testBody = {inc_votes: -100};
    return request(app)
    .patch('/api/articles/1337')
    .send(testBody)
    .expect(404)
    .then(({text})=>{
      expect(text).toBe('Not Found')
    })
  })
  test("400: returns 'Please include a vote integer' if no votes are sent", ()=>{
    const testBody = {};
    return request(app)
    .patch('/api/articles/1')
    .send(testBody)
    .expect(400)
    .then(({text})=>{
      expect(text).toBe('Please include a vote integer')
    })
  })
  test("400: returns 'Please include a vote integer' if inc_votes is not an integer", ()=>{
    const testBody = {inc_votes: 'one hundred'};
    return request(app)
    .patch('/api/articles/1')
    .send(testBody)
    .expect(400)
    .then(({text})=>{
      expect(text).toBe('Please include a vote integer')
    })
  })
})
describe.only("DELETE /api/comments/:comment_id", ()=>{
  test("204: deletes comment by comment_id, returning no content", ()=>{
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then(({body})=>{
      expect(body).toEqual({})
    })
  })
  test("404: returns 'Not Found' when comment_id doesn't exist", ()=>{
    return request(app)
    .delete('/api/comments/1337')
    .expect(404)
    .then(({text})=>{
      expect(text).toBe('Not Found')
    })
  })
  test("400: returns 'Please provide integer for comment_id' when provided a non-integer", ()=>{
    return request(app)
    .delete('/api/comments/one')
    .expect(400)
    .then(({text})=>{
      expect(text).toBe('Please provide integer for comment_id')
    })
  })
})