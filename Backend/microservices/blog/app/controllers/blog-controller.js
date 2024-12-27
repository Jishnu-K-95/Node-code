import { validationResult } from "express-validator";

import BlogModel from "../models/blog-model.js";

export const create = async (req, res, next) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            Message: errors
               .array({ onlyFirstError: true })
               .map((x) => x.msg)
               .toString(),
         });
      }

      const { title, content, author } = req.body;

      BlogModel.countDocuments({ title, isDeleted: false })
         .exec()
         .then((blogsCount) => {
            if (blogsCount > 0) {
               return res.status(400).send("User already exists");
            }

            BlogModel.create({
               title,
               content,
               author,
            }).catch((err) => {
               next(err);
            });

            return res.status(201).send("Blog created");
         })
         .catch((err) => {
            next(err);
         });
   } catch (error) {
      next(error);
   }
};

export const getBlogs = async (req, res, next) => {
   try {
      const blogsAggregateQuery = BlogModel.aggregate();

      blogsAggregateQuery.lookup({
         from: "users",
         localField: "author",
         foreignField: "_id",
         as: "author",
      });

      blogsAggregateQuery.match([
         {
            isDeleted: false,
            "$author.isDeleted": false,
         },
      ]);

      blogsAggregateQuery.project({
         _id: 1,
         title: 1,
         content: 1,
         shortNote: {
            $concat: [{ $ifNull: ["$title", ""] }, " ", { $ifNull: ["$author.username", ""] }],
         },
         createdAt: 1,
         updaredAt: 1,
      });

      blogsAggregateQuery.sort({
         createdAt: -1,
      });

      const customLabels = {
         totalDocs: "TotalRecords",
         docs: "Blogs",
         limit: "PageSize",
         page: "CurrentPage",
      };

      const aggregatePaginateOptions = {
         customLabels,
         page: req.query.page,
         limit: req.query.limit,
      };

      BlogModel.aggregatePaginate(
         blogsAggregateQuery,
         aggregatePaginateOptions,
         (error, result) => {
            if (error) {
               next(error);
            }

            return res.status(200).json({ result });
         }
      );
   } catch (error) {
      next(error);
   }
};

export const viewBlog = async (req, res, next) => {
   try {
      const { blogId } = req.params;

      BlogModel.findById(blogId)
         .populate("author")
         .lean()
         .exec()
         .then((result) => {
            if (!result) {
               return res.status(404).send("Blog not found");
            }

            return res.status(200).json({ result });
         })
         .catch((err) => {
            next(err);
         });
   } catch (error) {
      next(error);
   }
};

export const editBlog = async (req, res, next) => {
   try {
      const { blogId } = req.params;
      const { title, content } = req.body;

      BlogModel.findById(blogId)
         .exec()
         .then((result) => {
            if (!result) {
               return res.status(404).send("Blog not found");
            }

            result.title = title;
            result.content = content;

            result.save().catch((err) => {
               next(err);
            });

            return res.status(201).send("Blog updated");
         })
         .catch((err) => {
            next(err);
         });
   } catch (error) {
      next(error);
   }
};

export const deleteBlog = async (req, res, next) => {
   try {
      const { blogId } = req.params;

      BlogModel.findById(blogId)
         .exec()
         .then((result) => {
            if (!result) {
               return res.status(404).send("Blog not found");
            }

            result.isDeleted = true;

            result.save().catch((err) => {
               next(err);
            });

            return res.status(201).send("Blog mark deleted");
         })
         .catch((err) => {
            next(err);
         });
   } catch (error) {
      next(error);
   }
};
