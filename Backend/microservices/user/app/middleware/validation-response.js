import { validationResult } from "express-validator";

const validationResponse = (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({
         Message: errors.array({ onlyFirstError: true }).map((x) => x.msg),
      });
   }

   next();
};

export default validationResponse;
