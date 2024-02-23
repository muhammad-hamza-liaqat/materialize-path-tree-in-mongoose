const mongo = require("mongoose");
mongo
  .connect(process.env.database_URL_connection_STRING)
  .then(() => {
    console.log("MongoDB connected to trees!");
  })
  .catch((error) => {
    console.log("MongoDB not connected! error: ", error);
  });
module.exports = mongo;