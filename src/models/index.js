const Cart = require("./Cart");
const Category = require("./Category");
const Product = require("./Product");
const User = require("./User");

//Product -> categoryId
Product.belongsTo(Category)
Category.hasMany(Product)

//cart -> userId
Cart.belongsTo(User)
User.hasMany(Cart)

// //cart -> product
Cart.belongsTo(Product)
Product.hasMany(Cart)




