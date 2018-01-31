/**
 * Created by HP on 17.12.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TheoryText = new Schema({
    title: String,
    section: String,
    images: {
        image1:Object,
        image2: Object,
        image3: Object
    },
    texts: {
        text1: String,
        text2: String,
        text3: String
    }

});

module.exports = mongoose.model('theorytexts', TheoryText);