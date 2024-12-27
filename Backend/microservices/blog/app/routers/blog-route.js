import express from "express";

import {
   create,
   getBlogs,
   viewBlog,
   editBlog,
   deleteBlog,
} from "../controllers/blog-controller.js";

import blogValidate from "../validators/blog-validator.js";

import userAuthentication from "../middleware/authentication.js";

const router = express.Router();

router.post("/register", userAuthentication, blogValidate("blogCreate"), create);

router.get("/lists", userAuthentication, getBlogs);

router.get("/view/:blogId", userAuthentication, viewBlog);

router.post("/view/:blogId", userAuthentication, editBlog);

router.delete("/delete/:blogId", userAuthentication, deleteBlog);

export default router;
