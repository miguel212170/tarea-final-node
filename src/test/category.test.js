const request = require('supertest')
const app = require('../app')


const BASE_URL = '/api/v1/categories'
const BASE_URL_AUTH = '/api/v1/users/login'
let token, categoryId


beforeAll(async()=>{
    const body = {
        email    : 'mticona@gmail.com',
        password : '987654',
    }
    const res = await request(app)
        .post(BASE_URL_AUTH)
        .send(body)

    token = res.body.token
})


test('POST => BASE_URL should return statusCode 201 and res.body.name === category.name', async() => {
    const category = {
        name: 'Moviles'
    }
    
    const res = await request(app)
        .post(BASE_URL)
        .send(category)
        .set('Authorization', `Bearer ${token}`)

    categoryId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(category.name)
})


test('GET => BASE_URL should return statusCode 200, res.body to defined and res.body.length === 1', async() => {

    const res = await request(app)
    .get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})


test('DELETE => BASE_URL/:id should return statusCode 204', async() => {

    const res = await request(app)
    .delete(`${BASE_URL}/${categoryId}`)
    .set('Authorization', `Bearer ${token}`)
    
    expect(res.status).toBe(204)
})