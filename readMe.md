# API Endpoints Documentation

## Endpoints

### Add New Node

- **Endpoint**: `POST /new/add-new-node`
- **Description**: Adds a new node to the materialized path tree.
- **Request Body**: JSON object containing the details of the new node.
- **Success Response**: 
  - **Status Code**: 200 OK
  - **Content**: Success message
- **Error Response**:
  - **Status Code**: 400 Bad Request
  - **Content**: Message indicating required fields are missing.

### Find Path

- **Endpoint**: `GET /new/find-path/:id`
- **Description**: Finds the path of a node in the materialized path tree.
- **Parameters**:
  - `id`: The ID of the node to find the path for.
- **Success Response**:
  - **Status Code**: 200 OK
  - **Content**: JSON containing the path of the node.
- **Error Response**:
  - **Status Code**: 404 Not Found
  - **Content**: Message indicating the node with the given ID is not found.

### Find Subtree

- **Endpoint**: `GET /new/find-subtree/:id`
- **Description**: Finds the subtree rooted at a given node in the materialized path tree.
- **Parameters**:
  - `id`: The ID of the root node of the subtree.
- **Success Response**:
  - **Status Code**: 200 OK
  - **Content**: JSON containing the node, its ancestors, and its children.
- **Error Response**:
  - **Status Code**: 404 Not Found
  - **Content**: Message indicating the node with the given ID is not found.
