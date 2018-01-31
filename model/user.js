/**
 * Created by HP on 07.12.2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var localusers = new Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
    testsdone: { type: Number, default: 0 },
    testspassed: { type: Number, default: 0 },
    exercisesdone: { type: Number, default: 0},
    exercisespassed: { type: Number, default: 0}
});

module.exports = mongoose.model('localusers', localusers);