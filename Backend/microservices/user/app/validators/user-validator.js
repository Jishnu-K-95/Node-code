import { body, query } from "express-validator";

const userValidate = (method) => {
   switch (method) {
      case "userRegistration":
         return [
            body("username", "Provide an username").trim().notEmpty(),
            body("email", "Provide an email").trim().notEmpty().isEmail(),
            body("password", "Provide a password").trim().notEmpty(),
         ];

      case "userLogin":
         return [
            body("email", "Provide an email").trim().notEmpty().isEmail(),
            body("password", "Provide a password").trim().notEmpty(),
         ];
      case "checkUserBlogsLimit":
         return [
            query("blogsLimit", "Provide a valid number to the blogsLimit")
               .optional()
               .isNumeric()
               .custom((value, { req }) => {
                  return new Promise((resolve, reject) => {
                     try {
                        if (value > 0) {
                           resolve(true);
                        }

                        reject("Provide a valid number to the blogsLimit");
                     } catch (error) {
                        reject(error);
                     }
                  });
               }),
         ];
      default:
         break;
   }
};

export default userValidate;
