const request = require('supertest')
const app = require('../app')


const user = {
    firstName: "Miguel",
    lastName: "Ticona",
    email: "miguel@gmail.com",
    password: "12345",
    phone: "+987654789"
}

const BASE_URL = '/api/v1/users'
let token, userLogged, userId

beforeAll(async()=>{
    const body = {
        email    : 'mticona@gmail.com',
        password : '987654',
    }
    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(body)

    token = res.body.token
    userLogged = res.body.user
})


test('POST => BASE_URL should return status 201 and res.body.firstName === user.firstName', async() => {
    
    const res = await request(app)
        .post(BASE_URL)
        .send(user)

    userId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(user.firstName)  
})


test('GET => BASE_URL should return status code 200, adn res.body.length === 1', async() => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(2)
})


test('PUT => BASE_URL/:id should return status code 200 and res.body.firstName === user.firstName', async() => {
    const userUpdate = {
        firstName: 'Miguel',
        lastName : 'Angel',     
    }

    const res = await request(app)
        .put(`${ BASE_URL }/${userId}`)
        .send(userUpdate)
        .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(userUpdate.firstName)
})

// Test of Error Login
test('POST => BASE_URL/login should return statusCode 401', async() => {
    const user = {
        email: 'masd@gmail.com',
        password: '1321235'
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(user)
    
    expect(res.statusCode).toBe(401)
})

// Test Login
test('POST => BASE_URL/login should return status code 200, res.body.user and res.body.token to be defined and res.body.user.email === user.email', async() => {
    const user = {
        email: 'mticona@gmail.com',
        password: '987654'
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(user)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.token).toBeDefined()
    expect(res.body.user).toBeDefined()
    expect(res.body.user.email).toBe(user.email)
})

// Test Logged
test('POST => BASE_URL/me should return statusCode 200, re.body.id === userLogged.id and re.body.name === userLogged.name', async() => {
    const res = await request(app)
        .get(`${BASE_URL}/me`)
        .set('Authorization', `Bearer ${token}`)
        
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.id).toBe(userLogged.id)
    expect(res.body.name).toBe(userLogged.name)
})


test('DELETE => BASE_URL/:id should return statusCode 204', async() => {

    const res = await request(app)
        .delete(`${BASE_URL}/${userId}`)
        .set('Authorization', `Bearer ${token}`)

    
    expect(res.statusCode).toBe(204)
})