import mongoose from "mongoose";

const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema({
   username: {
      type: mongoose.SchemaTypes.String,
      required: true,
   },
   email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      lowercase: true,
      unique: true,
   },
   password: {
      type: mongoose.SchemaTypes.String,
      required: true,
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

userSchema.plugin(aggregatePaginate);

const user = mongoose.model("User", userSchema);

const customLabels = {
   totalDocs: "TotalRecords",
   docs: "Users",
   limit: "PageSize",
   page: "CurrentPage",
};

user.aggregatePaginate.options = {
   customLabels: customLabels,
};

export default user;
