const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, maxLength: 100 },
  date: { type: Date, default: Date.now() },
  likes: [{ type: Schema.Types.ObjectId, ref: "User"}]
});

// Virtual for User's URL
PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/User/${this.user}/Post/${this._id}`;
});

PostSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
}); 

// Export model
module.exports = mongoose.model("Post", PostSchema, "Posts");