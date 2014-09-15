
var restful = require('node-restful');
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BetSchema = mongoose.Schema({
    weekNumber: {type: 'number', required: true},
    scores: {type: Array, required: true},
    points: {type: 'number', required: false},
    ended: {type: Boolean, required: false},
    username: {type: 'string', required: false},
    userId: {type: ObjectId, required: false},
    status: {type: 'string', required: false}
});

module.exports = restful.model('bet', BetSchema);