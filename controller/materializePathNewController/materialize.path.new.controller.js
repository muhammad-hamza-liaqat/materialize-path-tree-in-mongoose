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
  const id = req.params.id;
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
    console.log("path=>", exactPath);
    return res.status(200).json({ message: "path fetched", data: exactPath });
  } catch (error) {
    console.log("findPath error", error);
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

const findSubTree = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "id is required in the params!" });
  }
  try {
    const node = await MaterializePathModel.findOne({ _id: id });
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }
    let ancestorIds = [];
    if (node.path !== null) {
      ancestorIds = node.path
        .split(",")
        .filter((item) => item !== "")
        .slice(1);
    }
    let ancestors = [];
    if (ancestorIds.length > 0) {
      ancestors = await MaterializePathModel.find({
        _id: { $in: ancestorIds },
      });
      ancestors.sort(
        (a, b) => a.path.split(",").length - b.path.split(",").length
      );
    }

    if (node.path !== null) {
      const rootNode = await MaterializePathModel.findOne({ path: null });
      if (rootNode) {
        ancestors.unshift(rootNode);
      }
    }
    const children = await MaterializePathModel.find({
      path: { $regex: `,${id},` },
    });

    const subtree = {
      node,
      ancestors,
      children,
    };

    console.log("data=>", subtree);
    return res.status(200).json({ message: "Data fetched", data: subtree });
  } catch (error) {
    console.log("findSubTree error", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

// const graphPath = async (req, res) => {
//   const id = req.params.id;
//   console.log("Searching for node with ID:", id);
//   if (!id) {
//     return res.status(400).json({ message: "ID is required in the params" });
//   }
//   try {
//     // Perform graph lookup aggregation to find the path
//     const pathToFind = await MaterializePathModel.aggregate([
//       {
//         $match: {
//           _id: id
//         }
//       },
//       {
//         $graphLookup: {
//           from: "materialpattrees", // Name of the collection
//           startWith: "$path", // Start with the path of the current node
//           connectFromField: "path",
//           connectToField: "_id", // Connect to the _id field of parent nodes
//           as: "ancestors",
//           depthField: "depth", // Optional field to track the depth
//           maxDepth: 25 // Adjust the depth limit as needed
//         }
//       }
//     ]);

//     console.log("Graph lookup result:", pathToFind);

//     if (!pathToFind || pathToFind.length === 0) {
//       console.log("No record found against this ID:", id);
//       return res.status(404).json({ message: "No record found against this ID" });
//     }

//     // Extract the exact path from the result
//     const exactPath = pathToFind[0].ancestors.map(node => node._id);
//     console.log("Path found for ID:", id);
//     console.log("Path:", exactPath);
//     return res.status(200).json({ message: "Path fetched", data: exactPath });
//   } catch (error) {
//     console.error("Error occurred in findPath:", error);
//     return res.status(500).json({ message: "Internal server error", error: error });
//   }
// };



module.exports = { newNodeToAdd, findPath, findSubTree };
