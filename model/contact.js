/**
 * Created by HP on 08.01.2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contact = new Schema({
    teacher_name: String,
    subject_site: String,
    information: String

});

module.exports = mongoose.model('contact', contact);