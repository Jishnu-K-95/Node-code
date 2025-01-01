import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";

import UserModel from "../models/user-model.js";

import BlogModel from "../models/blog-model.js";

export const registration = async (req, res, next) => {
   try {
      const { username, email, password } = req.body;

      UserModel.countDocuments({ email: email, isDeleted: false })
         .exec()
         .then((usersCount) => {
            if (usersCount > 0) {
               return res.status(400).send("User already exists");
            }

            //new user
            const hashPassword = jwt.sign(password, process.env.JWT_SALT);

            UserModel.create({
               username,
               email,
               password: hashPassword,
            }).catch((err) => {
               next(err);
            });

            return res.status(201).send("User registered");
         })
         .catch((err) => {
            next(err);
         });
   } catch (error) {
      next(error);
   }
};

export const login = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      const hashPassword = jwt.sign(password, process.env.JWT_SALT);

      UserModel.findOne({ email: email, password: hashPassword, isDeleted: false })
         .exec()
         .then((user) => {
            if (!user) {
               return res.status(404).send("Please check your inputs");
            }

            //new user
            jwt.verify(hashPassword, process.env.JWT_SALT, (err, dataDecoded) => {
               if (err) {
                  next(err);
               }

               const encryptedUserData = jwt.sign(
                  {
                     username: user.username,
                     email: user.email,
                  },
                  process.env.JWT_SALT,
                  {
                     expiresIn: "1h",
                  }
               );

               const headers = {};

               headers.accessToken = encryptedUserData;

               return res.set(headers).status(200).send("OK Success");
            });
         })
         .catch((err) => {
            next(err);
         });
   } catch (error) {
      next(error);
   }
};

export const getUsers = async (req, res, next) => {
   try {
      const usersAggregateQuery = UserModel.aggregate();

      const { blogsLimit = 10 } = req.query;

      usersAggregateQuery.lookup({
         from: "blogs",
         let: {
            userId: "$_id",
         },
         pipeline: [
            {
               $match: {
                  $expr: {
                     $eq: ["$author", "$$userId"],
                  },
               },
            },
            {
               $limit: parseInt(blogsLimit, 10),
            },
         ],
         as: "blogs",
      });

      usersAggregateQuery.match({
         isDeleted: false,
         "blogs.isDeleted": false,
      });

      usersAggregateQuery.project({
         _id: 1,
         username: 1,
         email: 1,
         blogs: {
            title: 1,
            content: 1,
         },
         blogsCount: {
            $size: "$blogs",
         },
         Status: {
            $cond: {
               if: { $eq: ["$isDeleted", false] },
               then: "Active",
               else: "Deleted",
            },
         },
         createdAt: 1,
         updatedAt: 1,
      });

      usersAggregateQuery.sort({
         createdAt: -1,
      });

      const customLabels = {
         totalDocs: "TotalRecords",
         docs: "Users",
         limit: "PageSize",
         page: "CurrentPage",
      };

      const aggregatePaginateOptions = {
         customLabels,
         page: req.query.page,
         limit: req.query.limit,
      };

      UserModel.aggregatePaginate(
         usersAggregateQuery,
         aggregatePaginateOptions,
         (error, result) => {
            if (error) {
               next(error);
            }

            res.status(200).json({ result });
         }
      );
   } catch (error) {
      next(error);
   }
};
