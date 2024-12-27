import mongoose from "mongoose";

import { getMongoDbConfig } from "../utilities/functions.js";

const connectMongoDb = () => {
   try {
      const { host } = getMongoDbConfig();

      mongoose.connect(host);

      const dbConnection = mongoose.connection;

      dbConnection.on("error", function (err) {
         console.log("Connection failed: " + err?.message);
      });

      dbConnection.once("open", function () {
         console.log("Connection success");
      });

      mongoose.Promise = global.Promise;

      return;
   } catch (error) {
      throw error;
   }
};

export default connectMongoDb;
