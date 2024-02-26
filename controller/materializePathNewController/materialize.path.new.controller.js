const MaterializePathModel = require("../../models/materializePath.model");

const newNodeToAdd = async (req, res) => {
  try {
    const newNodeId = req.body.newNodeId;
    const parentId = req.body.parentId;
    let newPath = null;

    const isRootNode = (await MaterializePathModel.countDocuments()) === 0;

    // If the database is not empty, parent ID must be provided
    if (!isRootNode && !parentId) {
      return res
        .status(400)
        .json({ message: "Parent ID is required for non-root nodes" });
    }

    // If newNodeId is not provided, return an error
    if (!newNodeId) {
      console.log("new nodeID is required");
      return res.status(400).json({ message: "New node ID is required" });
    }

    // If parentId is provided, find the parent node and update the path
    if (parentId) {
      const parentNode = await MaterializePathModel.findById(parentId);
      if (!parentNode) {
        console.log("parent not found!");
        return res.status(404).json({ message: "Parent node not found" });
      }
      newPath = (parentNode.path || ",") + parentId + ",";
    }

    // Create the new node
    const newNode = new MaterializePathModel({
      _id: newNodeId,
      path: newPath,
    });

    // Save the new node
    await newNode.save();
    console.log("node added succesfully", newNode);
    // Respond with success message and the added node
    return res
      .status(201)
      .json({ message: "Node added successfully", newNode });
  } catch (error) {
    console.error("Error adding new node:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const findPath = async (req, res) => {
  // res.end("hello from find path");
  const  id = req.params.id;
  console.log(id);
  if (!id) {
    return res.status(400).json({ message: "id is required in the params" });
  }
  try {
    const pathToFind = await MaterializePathModel.findOne({ _id: id });
    if (!pathToFind) {
      return res
        .status(404)
        .json({ message: "no record found against this id" });
    }
    const exactPath = pathToFind.path;
    console.log(`path found against ${id}`);
    console.log("path=>",exactPath);
    return res.status(200).json({ message: "path fetched", data: exactPath });
  } catch (error) {
    console.log("findPath error", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

module.exports = { newNodeToAdd, findPath };
