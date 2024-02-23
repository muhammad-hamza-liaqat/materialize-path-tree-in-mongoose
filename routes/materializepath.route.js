const express = require("express");
const { addingNode, findingSubTree } = require("../controller/materializePath.controller");
const materialRoute = express.Router();

materialRoute.route("/add-node").post(addingNode)
materialRoute.route("/find-subtree/:id").get(findingSubTree)
module.exports = materialRoute