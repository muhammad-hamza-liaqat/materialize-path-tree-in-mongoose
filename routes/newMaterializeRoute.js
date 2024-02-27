const express = require("express");
const {
  newNodeToAdd,
  findPath,
  findSubTree,
  graphPath,
} = require("../controller/materializePathNewController/materialize.path.new.controller.js");
const newMaterializeRoutes = express.Router();

newMaterializeRoutes.route("/add-new-node").post(newNodeToAdd);
newMaterializeRoutes.route("/find-path/:id").get(findPath);
newMaterializeRoutes.route("/find-subtree/:id").get(findSubTree);
// newMaterializeRoutes.route("/find-graph-path/:id").get(graphPath);


module.exports = { newMaterializeRoutes };
