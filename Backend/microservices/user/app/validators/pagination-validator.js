import { query } from "express-validator";

const paginationValidate = (method) => {
   switch (method) {
      case "checkPageLimit":
         return [query("limit", "Provide a valid number to the limit").optional().isNumeric()];
      case "checkPageNo":
         return [query("page", "Provide a valid number to the page").optional().isNumeric()];

      default:
         break;
   }
};

export default paginationValidate;
