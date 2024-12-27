import { body, param } from "express-validator";

const blogValidate = (method) => {
   switch (method) {
      case "blogCreate":
         return [
            body("title", "Provide a title").trim().notEmpty(),
            body("content", "Provide a content").trim().notEmpty(),
            body("author", "Provide an author").trim().notEmpty(),
         ];

      case "blogUpdate":
         return [
            body("title", "Provide a title").trim().notEmpty(),
            body("content", "Provide a content").trim().notEmpty(),
         ];

      default:
         break;
   }
};

export default blogValidate;
