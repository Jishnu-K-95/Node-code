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

router.get("/view/:blogId?", userAuthentication, blogValidate("checkBlogId"), viewBlog);

router.put(
   "/edit/:blogId?",
   userAuthentication,
   blogValidate("checkBlogId"),
   blogValidate("blogUpdate"),
   editBlog
);

router.delete("/delete/:blogId", userAuthentication, blogValidate("checkBlogId"), deleteBlog);

export default router;
