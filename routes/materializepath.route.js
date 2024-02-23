const express = require("express");
const { addingNode, findPath, subTreeFromNode } = require("../controller/materializePath.controller");
const materialRoute = express.Router();

materialRoute.route("/add-node").post(addingNode)
materialRoute.route("/find-path/:id").get(findPath)
materialRoute.route("/subtree/:id").get(subTreeFromNode)
module.exports = materialRoute