// require('../models')
// const supertest = require("supertest")
// const app = require('../app')
// const Product = require('../models/Product')

// const URL_PURCHASE = '/purchase'
// const URL_USER = '/users/login'

// let TOKEN
// let userId
// let product
// let productBody

// beforeAll(async () => {
//   //inicio de sesion
//   const user = {
//     email: "fernando@gmail.com",
//     password: 'fernando1234'
//   }

//   const res = await supertest(app)
//     .post(URL_USER)
//     .send(user)

//   TOKEN = res.body.token
//   userId = res.body.user.id
//   //PRODUCT
//   productBody = {
//     title: 'lorem10',
//     description: 'lorem30',
//     price: 45.65
//   }

//   product = await Product.create(productBody)

//   bodyCart = {
//     productId: product.id,
//     quantity: 3
//   }
//   await supertest(app)
//     .post('/cart')
//     .send(bodyCart)
//     .set("Authorization", `Bearer ${TOKEN}`)
// })
