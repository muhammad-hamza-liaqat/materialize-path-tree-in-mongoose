const pathModel = require("../models/materializePath.model");

// adding node within materialize path tree logic
const addingNode = async (req, res) => {
  try {
    const { name, parentPath } = req.body;

    let newPath;
    if (!parentPath) {
      // If no parentPath is provided, it's a main node or parent node
      newPath = null;
    } else {
      // If parentPath is provided, it's a child node
      newPath = parentPath;
    }

    const newCategory = new pathModel({
      _id: name,
      path: newPath,
    });

    await newCategory.save();
    console.log("node added: ", newCategory);
    res
      .status(201)
      .json({ message: "node added successfully", dataAdded: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// searching within materialize path tree using grapgh lookup aggregation
const findPath = async (req, res) => {
  try {
    const startTime = Date.now();
    const nodeName = req.params.id;
    const node = await pathModel.findOne({ _id: nodeName });
    if (!node) {
      return res.status(404).json({ error: "Node not found" });
    }
    const path = [node];
    let currentNode = node;
    while (currentNode.path !== null) {
      const parent = await pathModel.findOne({ _id: currentNode.path });
      if (!parent) {
        break;
      }
      path.unshift(parent);
      currentNode = parent;
    }
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime} milliseconds`);

    res.json({ startNode: nodeName, path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// finding subtree from a specific node
const subTreeFromNode = async (req, res) => {
  try {
    const { id } = req.params;
    const pipeline = [
      {
        $graphLookup: {
          from: "materializepaths",
          startWith: id,
          connectFromField: "_id",
          connectToField: "path",
          as: "subtree",
          maxDepth: 100,
        },
      },
      {
        $sort: { "subtree._id": 1 }, 
      },
    ];

    const result = await pathModel.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Node not found" });
    }

    res.status(200).json({ message: "Subtree found", subtree: result[0].subtree });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// finding the data of a tree
const findData = async (req,res)=>{
  const data = await pathModel.find({})
  return res.status(200).json({message: "data fetched", data: data})
}

module.exports = { addingNode, findPath, subTreeFromNode, findData };
