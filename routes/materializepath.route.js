const express = require("express");
const { addingNode, findPath, subTreeFromNode, findData } = require("../controller/materializePath.controller");
const materialRoute = express.Router();

materialRoute.route("/add-node").post(addingNode)
materialRoute.route("/find-path/:id").get(findPath)
materialRoute.route("/subtree/:id").get(subTreeFromNode)
materialRoute.route("/all").get(findData)
module.exports = materialRoute