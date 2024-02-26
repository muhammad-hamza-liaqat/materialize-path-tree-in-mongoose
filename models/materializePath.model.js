const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materializePathSchema = new Schema({
    _id: {type: String, required: true},
    path: {type: String, default: null}
});

const MaterializePathModel = mongoose.model('MaterializePath', materializePathSchema);

module.exports = MaterializePathModel;
