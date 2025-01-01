import express from "express";

import { registration, login, getUsers } from "../controllers/user-controller.js";

import userValidate from "../validators/user-validator.js";
import paginationValidate from "../validators/pagination-validator.js";

import userAuthentication from "../middleware/authentication.js";
import validationResponse from "../middleware/validation-response.js";

const router = express.Router();

router.post("/register", userValidate("userRegistration"), validationResponse, registration);

router.post("/login", userValidate("userLogin"), validationResponse, login);

router.get(
   "/lists",
   userAuthentication,
   paginationValidate("checkPageLimit"),
   paginationValidate("checkPageNo"),
   userValidate("checkUserBlogsLimit"),
   validationResponse,
   getUsers
);

export default router;
