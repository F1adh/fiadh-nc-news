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
      console.log(article)
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
     
      expect(text).toBe('Resource not found')
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

describe.only("GET /api/articles", ()=>{
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