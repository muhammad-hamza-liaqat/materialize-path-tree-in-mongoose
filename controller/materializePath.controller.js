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
const findingSubTree = async (req, res) => {
  try {
    const startTime = Date.now();

    const nodeName = req.params.id;
    const node = await pathModel.aggregate([
      {
        $match: { _id: nodeName },
      },
      {
        $graphLookup: {
          from: "materializepaths",
          startWith: "$path",
          connectFromField: "path",
          connectToField: "_id",
          as: "ancestors",
        },
      },
      {
        $project: {
          // enabling the index
          path: 1,
          ancestors: 1,
        },
      },
    ]);
    // in how much time it finds the data from the materialize path tree
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime} milliseconds`);

    if (!node || !node.length) {
      return res.status(404).json({ error: "Node not found" });
    }
    res.json({ path: node[0].path, ancestors: node[0].ancestors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const subTreeFromNode = async (req, res) => {
  try {
    const { id } = req.params;
    const pipeline = [
      {
        $match: { _id: id },
      },
      {
        $graphLookup: {
          from: "materializepaths",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "path",
          as: "subtree",
          maxDepth: 100,
        },
      },
      {
        $unwind: "$subtree",
      },
      {
        $addFields: {
          pathArray: { $split: ["$subtree.path", ","] },
          pathDepth: {
            $size: { $ifNull: [{ $split: ["$subtree.path", ","] }, []] },
          },
        },
      },
      {
        $sort: { pathDepth: 1, pathArray: 1 },
      },
      {
        $group: {
          _id: "$_id",
          subtree: { $push: "$subtree" },
        },
      },
    ];

    const result = await pathModel.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Node not found" });
    }
    const subtreeNodes = result[0].subtree;

    res.status(200).json({ message: "Subtree found", subtree: subtreeNodes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addingNode, findingSubTree, subTreeFromNode };
