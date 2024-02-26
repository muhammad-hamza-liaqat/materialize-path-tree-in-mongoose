const mongoose = require('mongoose');

const treeNodeSchema = new mongoose.Schema({
  name: String,
  path: String
});

const MaterializePathModel = mongoose.model('MaterializePath', treeNodeSchema);

module.exports = MaterializePathModel;
