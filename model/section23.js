/**
 * Created by HP on 04.01.2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var section23 = new Schema({
    title: String,
    image: Object,
    text: String
});

module.exports = mongoose.model('section23', section23);