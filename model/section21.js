/**
 * Created by HP on 20.12.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var section21 = new Schema({
    title: String,
    defimage: Object,
    deftext: String
});

module.exports = mongoose.model('section21', section21);