const pathModel = require("../models/materializePath.model")

const addingNode = async (req, res) => {
    try {
      const { name, parentPath } = req.body;
  
      let newPath;
      if (!parentPath) {
        // If no parentPath is provided, it's a main node or parent node
        newPath = null;
      } else {
        // If parentPath is provided, it's a child node
        newPath = parentPath + ',' + name;
      }
  
      const newCategory = new pathModel({
        _id: name,
        path: newPath
      });
  
      await newCategory.save();
  
      res.status(201).json({ message: 'node added successfully', dataAdded: newCategory });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add category' });
    }
  };
  

const findingSubTree = async (req,res)=>{
    // res.end ("hello from subtree");
    try {
        const nodeId = req.params.id;
        const subtree = await pathModel.aggregate([
          {
            $match: {
              _id: nodeId
            }
          },
          {
            $graphLookup: {
              from: 'materializepaths', 
              startWith: '$path',
              connectFromField: 'path',
              connectToField: '_id',
              as: 'children'
            }
          }
        ]);
    
        if (subtree.length === 0) {
          return res.status(404).json({ error: 'Node not found' });
        }
    
        res.json({ subtree: subtree[0] });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
}
  


module.exports = { addingNode, findingSubTree };
