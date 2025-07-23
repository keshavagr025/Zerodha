const {model} = require('mongoose');

const { positionsSchema } = require('../schemas/PositionsSchema');

const PositionsModel = new model('position', positionsSchema);

module.exports = { PositionsModel };