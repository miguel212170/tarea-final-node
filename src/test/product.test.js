require('../models')
const request = require('supertest')
const app = require('../app')
const path = require('path')

const Category = require('../models/Category')


const BASE_URL = '/api/v1/products'
const BASE_URL_AUTH = '/api/v1/users/login'
const BASE_URL_IMAGES = '/api/v1/product_images'
let token, category, product, productId, image


beforeAll(async()=>{
    const body = {
        email    : 'mticona@gmail.com',
        password : '987654',
    }
    const res = await request(app)
        .post(BASE_URL_AUTH)
        .send(body)

    token = res.body.token


    category = await Category.create({
        name: 'Clothes'
    })

    product = {
        title: 'Shirt',
        description: 'Basic shirt of color black',
        price: 200,
        categoryId: category.id
    }

    // Create image
    const localImage = path.join(__dirname, 'createData', 'test-img.png')
    image = await request(app)
        .post(BASE_URL_IMAGES)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', localImage)
        
})


afterAll(async()=>{
    await category.destroy()

    // Delete image
    await request(app)
        .delete(`${BASE_URL_IMAGES}/${ image.body.id }`)
        .set('Authorization', `Bearer ${token}`)
})


test('POST => BASE_URL should return statusCode 201, res.body.title === product.title and res.body.categoryId === category.id', async() => {

    const res = await request(app)
        .post(BASE_URL)
        .send(product)
        .set('Authorization', `Bearer ${token}`)
    
    productId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
    expect(res.body.categoryId).toBe(category.id)

})


test('GET => BASE_URL should return statusCode 200 and res.body to have length 1 ', async() => {
    
    const res = await request(app)
        .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})


test('GET => BASE_URL/:id should return statusCode 200 and res.body.name === produc.name ', async() => {
    
    const res = await request(app)
        .get(`${BASE_URL}/${ productId }`)

    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect( res.body.title ).toBe( product.title )
})

test('PUT => BASE_URL/:id should return statusCode 200 and res.body.title === productUpdate.title', async() => {
   
    const productUpdate = {
        title: 'Pants',
        description: 'Basic pants blue',
        price: 250
    }

    const res = await request(app)
        .put(`${BASE_URL}/${ productId }`)
        .send(productUpdate)
        .set('Authorization', `Bearer ${token}`)

    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe( productUpdate.title )
})

// setImages
test('POST => BASE_URL/:id/images should return statusCode 200 and res.body', async() => {

    const res = await request(app)
        .post(`${BASE_URL}/${ productId }/images`)
        .send([ image.body.id ])
        .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect( res.body[0].url ).toBe( image.body.url )
    expect( res.body[0].filename ).toBe( image.body.filename )
})

test('DELETE => BASE_URL/:id should return statusCode 204', async() => {
    const res = await request(app)
        .delete(`${BASE_URL}/${ productId }`)
        .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(204)
    
})