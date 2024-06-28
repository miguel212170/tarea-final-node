const catchError = require('../utils/catchError');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getAll = catchError(async(req, res) => {
    const { category } = req.query
    const where = {}

    const results = await Product.findAll({
        include:[Category],
    });
    if (category) where.category.id = category
    
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await Product.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Product.findByPk(id, {include: [Category]});
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Product.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Product.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});
module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}