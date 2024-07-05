const catchError = require('../utils/catchError');
const ProductImg = require('../models/ProductImg');
const path = require('path')
const fs = require('fs')

const getAll = catchError(async(req, res) => {
    const results = await ProductImg.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {

    const { filename } = req.file

    const imageDB = await ProductImg.findOne({ where:{ filename } })

    if(imageDB){
        return res.sendStatus(404)
    }

    const url = `${req.protocol}://${ req.headers.host }/uploads/${filename}`

    const result = await ProductImg.create({ filename, url });
    return res.status(201).json(result);
});


const remove = catchError(async(req, res) => {
    const { id } = req.params;

    const result = await ProductImg.findByPk(id)

    if( !result ){
        return res.sendStatus(404)
    }

    const imagePath = path.join(__dirname, '..', 'public', 'uploads', result.filename)
    fs.unlinkSync(imagePath)


    await result.destroy()

    return res.sendStatus(204);
});


module.exports = {
    getAll,
    create,
    remove,
}