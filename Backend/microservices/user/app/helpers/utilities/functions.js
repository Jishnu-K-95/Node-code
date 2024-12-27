export const getMongoDbConfig = () => {
   const configDetails = {
      host: process.env.MONGO_DB_URL,
      database: process.env.MONGO_DB_NAME,
   };

   if (process.env.IS_TEST_MODE === true) {
      configDetails.database = process.env.MONGO_DB_NAME_TEST;
   }

   return configDetails;
};
