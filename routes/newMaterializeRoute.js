const express = require("express");
const { newNodeToAdd } = require("../controller/materializePathNewController/materialize.path.new.controllerjs");
const newMaterializeRoutes = express.Router();

newMaterializeRoutes.route("/add-new-node").post(newNodeToAdd);

module.exports = { newMaterializeRoutes };
