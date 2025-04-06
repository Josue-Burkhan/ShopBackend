//Contributed by Jared Scott

// Imports
const mongodb = require('../db/database'); //Change as needed for database function location
const ObjectId = require('mongodb').ObjectId;


// Database collection name values
const collection_name = 'carts'


//GET all carts
const getAllCarts = async (req, res, next) => {
    /* 
    #swagger.tags = ['Cart']
    #swagger.description = 'Get all carts'
    #swagger.responses[200] = { description: 'Successful response with all carts' }
    #swagger.responses[400] = { description: 'Bad request' }
    */
    try {
        const result = await mongodb.getDatabase().db().collection(collection_name).find();
        result.toArray()
            .then((users) => {
                res.setHeader('Content-type', 'applications/json');
                res.status(200).json(users);
            })
        if (!result) {
            send.status(400);
        }
    } catch (error) {
        next(error)
    }
};


//GET cart by ID
//This will have to be changed later for individual user shopping Carts
const getCartByUserId = async (req, res, next) => {
    /* 
        #swagger.tags = ['Cart']
        #swagger.description = 'Get cart by user ID'
        #swagger.parameters['id'] = { description: 'User ID of the cart', type: 'string' }
        #swagger.responses[200] = { description: 'Successful response with the cart data' }
        #swagger.responses[400] = { description: 'Error getting the cart' }
    */
    try {
        const cartId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection(collection_name).findOne({ _id: cartId });
        res.setHeader('Content-type', 'applications/json');
        res.status(200).json(users);
        res.status(400).json(response.error || 'Some error occured while getting cart')
    } catch (error) {
        next(error)
    }
};

//POST cart
const createCart = async (req, res, next) => {
    /* 
        #swagger.tags = ['Cart']
        #swagger.description = 'Create a new cart'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                products: ['product1', 'product2'],
                userId: 'string',
                cartTotal: 0
            }
        }
        #swagger.responses[200] = { description: 'Cart was created successfully' }
        #swagger.responses[500] = { description: 'Error creating cart' }
    */
    try {
        const cart = {
            products: req.body.products, //this will be an array of values
            userId: req.body.userId,
            cartTotal: req.body.cartTotal
        };
        const response = await mongodb.getDatabase().db().collection(collection_name).insertOne(cart);
        if (response.acknowledged) {
            res.status(200).json('User was Created');
        } else {
            res.status(500).json(response.error || 'Some error occured while creating cart.');
        }
    } catch (error) {
        next(error)
    }
}

//PUT cart by ID
const editCart = async (req, res, next) => {
    /* 
        #swagger.tags = ['Cart']
        #swagger.description = 'Update cart by ID'
        #swagger.parameters['id'] = { description: 'Cart ID', type: 'string' }
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                products: ['product1', 'product2'],
                userId: 'string',
                cartTotal: 0
            }
        }
        #swagger.responses[200] = { description: 'Cart was updated successfully' }
        #swagger.responses[500] = { description: 'Error updating cart' }
    */
    try {
        const cartId = new ObjectId(req.params.id);
        const cart = {
            products: req.body.products, //this will be an array of values
            userId: req.body.userId,
            cartTotal: req.body.cartTotal
        };
        const response = await mongodb.getDatabase().db().collection(collection_name).replaceOne({ _id: cartId }, cart);
        if (response.acknowledged) {
            res.status(200).json('Cart was Edited');
        } else {
            res.status(500).json(response.error || 'Some error occured while updating cart.');
        }
    } catch (error) {
        next(error)
    };
}

//DELETE cart by ID
const deleteCart = async (req, res, next) => {
    /* 
        #swagger.tags = ['Cart']
        #swagger.description = 'Delete cart by ID'
        #swagger.parameters['id'] = { description: 'Cart ID', type: 'string' }
        #swagger.responses[200] = { description: 'Cart was deleted successfully' }
        #swagger.responses[400] = { description: 'Error deleting cart' }
    */
    try {
        const cartId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection(collection_name).deleteOne({ _id: cartId });
        if (response.deletedCount > 0) {
            res.status(200).json('Cart was Deleted');
        } else {
            res.status(400).json(response.error || 'Some error occured while deleting the cart')
        };
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getAllCarts,
    getCartByUserId,
    createCart,
    editCart,
    deleteCart
}