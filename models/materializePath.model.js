const mongoose = require('mongoose');

const model = new mongoose.Schema({
  _id: String,
  path: String
});
const materializePathModel = mongoose.model('materializePath', model);

console.log("materializePath model sync completed!")

module.exports = materializePathModel;
