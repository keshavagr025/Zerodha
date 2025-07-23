const {model} = require('mongoose').model;
const { OrdersSchema } = require('../schemas/OrdersSchema');
const OrdersModel = new model('order', OrdersSchema);
module.exports = { OrdersModel };
