import express from "express";

import { registration, login, getUsers } from "../controllers/user-controller.js";

import userValidate from "../validators/user-validator.js";

import userAuthentication from "../middleware/authentication.js";

const router = express.Router();

router.post("/register", userValidate("userRegistration"), registration);

router.post("/login", userValidate("userLogin"), login);

router.get("/lists", userAuthentication, getUsers);

export default router;
