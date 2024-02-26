const express = require("express");
const { newNodeToAdd, findPath } = require("../controller/materializePathNewController/materialize.path.new.controller.js");
const newMaterializeRoutes = express.Router();

newMaterializeRoutes.route("/add-new-node").post(newNodeToAdd);
newMaterializeRoutes.route("/find-path/:id").get(findPath)
module.exports = { newMaterializeRoutes };
