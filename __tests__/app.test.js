const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/')

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
      console.log(topics)
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