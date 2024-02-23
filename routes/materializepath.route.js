const express = require("express");
const { addingNode, findingSubTree, subTreeFromNode } = require("../controller/materializePath.controller");
const materialRoute = express.Router();

materialRoute.route("/add-node").post(addingNode)
materialRoute.route("/find-subtree/:id").get(findingSubTree)
materialRoute.route("/subtree/:id").get(subTreeFromNode)
module.exports = materialRoute