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
      newPath = parentPath + "," + name;
    }

    const newCategory = new pathModel({
      _id: name,
      path: newPath,
    });

    await newCategory.save();

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
      const nodeName = req.params.id;
      const node = await pathModel.aggregate([
        {
          $match: { _id: nodeName }
        },
        {
          $graphLookup: {
            from: 'materializepaths', 
            startWith: '$path',
            connectFromField: 'path',
            connectToField: '_id',
            as: 'ancestors'
          }
        },
        {
          $project: {
            // enabling the index
            path: 1,
            ancestors: 1
          }
        }
      ]);
  
      if (!node || !node.length) {
        return res.status(404).json({ error: 'Node not found' });
      }
      res.json({ path: node[0].path, ancestors: node[0].ancestors });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = { addingNode, findingSubTree };
