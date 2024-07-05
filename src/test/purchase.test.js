require('../models')
const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')
const Cart = require('../models/Cart')

const BASE_URL = '/api/v1/purchase'
const BASE_URL_AUTH = '/api/v1/users/login'
let token, user, product, cart



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

    cart = await Cart.create({
        quantity: 1,
        productId: product.id,
        userId: user.id
    })

})

afterAll(async()=>{
    await product.destroy()
})

test('POST => BASE_URL should return status 201 and res.body.quantity === purchase.quantity', async() => {

    const res = await request(app)
        .post(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
    
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].quantity).toBe(cart.quantity)
    expect(res.body[0].productId).toBe(cart.productId)
    expect(res.body[0].userId).toBe(user.id)
})


test('GET => BASE_URL should return 200', async() => {

    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)    
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].quantity).toBe(cart.quantity)
    expect(res.body[0].productId).toBe(cart.productId)
})