const userAuthentication = async (req, res, next) => {
   try {
      if (!req.headers) {
         res.status(401).send("Unauthorized");
      }

      const accessToken = req.header("accessToken");

      if (!accessToken) {
         res.status(401).send("Unauthorized");
      }

      next();
   } catch (error) {
      throw error;
   }
};

export default userAuthentication;
