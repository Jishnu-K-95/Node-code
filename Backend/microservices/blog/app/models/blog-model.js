import mongoose from "mongoose";

const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const blogSchema = new mongoose.Schema({
   title: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
   },
   content: {
      type: mongoose.SchemaTypes.String,
      required: true,
   },
   author: {
      type: mongoose.SchemaTypes.ObjectId(),
      required: true,
      ref: "User",
   },
   isDeleted: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
   },
   createdAt: {
      type: mongoose.SchemaTypes.Date,
      required: true,
      default: () => Date.now(),
      immutable: true,
   },
   updaredAt: {
      type: mongoose.SchemaTypes.Date,
      required: true,
      default: () => Date.now(),
      immutable: true,
   },
});

blogSchema.plugin(aggregatePaginate);

const blog = mongoose.model("Blog", blogSchema);

const customLabels = {
   totalDocs: "TotalRecords",
   docs: "Blogs",
   limit: "PageSize",
   page: "CurrentPage",
};

blog.aggregatePaginate.options = {
   customLabels: customLabels,
};

export default blog;
