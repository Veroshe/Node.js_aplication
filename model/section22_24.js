/**
 * Created by HP on 20.12.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var section22_24 = new Schema({
    title: String,
    memimage: {
        imagechart: Object,
        imagedef: Object
    },
    section: String,
    text: String


});

module.exports = mongoose.model('section22_24', section22_24);