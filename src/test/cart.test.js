require('../models')
const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')


const BASE_URL = '/api/v1/cart'
const BASE_URL_AUTH = '/api/v1/users/login'
let token, product, cart, cartId, user


beforeAll(async()=>{
    const body = {
        email    : 'mticona@gmail.com',
        password : '987654',
    }
    const res = await request(app)
        .post(BASE_URL_AUTH)
        .send(body)

    token = res.body.token
    user  = res.body.user

    product = await Product.create({
        title: "shirt",
        description: "Basic black shirt",
        price: 250.5
    })

    cart = {
        quantity: 1,
        productId: product.id
    }
})

afterAll(async()=>{
    await product.destroy()
})


test('POST => BASE_URL should return status 201 and res.body.quantity === cart.quantity', async() => {

    const res = await request(app)
        .post(BASE_URL)
        .send(cart)
        .set('Authorization', `Bearer ${token}`)

    cartId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)
    expect(res.body.productId).toBe(cart.productId)
    expect(res.body.userId).toBe(user.id)

})


test('GET => BASE_ULR should return statusCode 200 and res.body[0].quantity === cart.quantity', async() => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body[0].quantity).toBe(cart.quantity)
    expect(res.body[0].userId).toBe(user.id)

})


test('GET => BASE_URL/:id should return statusCode 200 and res.body.quantity === cart.quantity', async() => {

    const res = await request(app)
        .get(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${token}`)
        
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)
    expect(res.body.userId).toBe(user.id)

})

test('PUT => BASE_URL/:id should return statusCode 200 and red.body.quantity === cartUpdate.quantity', async() => {

    const cartUpdate = {
        quantity: 1,
    }

    const res = await request(app)
        .put(`${BASE_URL}/${cartId}`)
        .send(cartUpdate)
        .set('Authorization', `Bearer ${token}`)
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cartUpdate.quantity)
    expect(res.body.userId).toBe(user.id)
})

test('DELETE => BASE_URL/:id should return statusCode 204', async() => {

    const res = await request(app)
        .delete(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(204)
})