/**
 * Created by HP on 12.12.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exercise = new Schema({
    question: Object,
    answer1: String,
    answer2: String,
    answer3: String,
    goodanswer: String,
    type: String
});

module.exports = mongoose.model('exercise', exercise);