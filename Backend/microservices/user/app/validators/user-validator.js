import { body, param } from "express-validator";

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
      default:
         break;
   }
};

export default userValidate;
