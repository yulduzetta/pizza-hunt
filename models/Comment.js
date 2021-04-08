const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment _id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(), // default value
    },
    replyBody: {
      type: String,
    },
    writtenBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now, // default value
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      // we need to tell the schema that it can use getters.
      // Getters let you transform data in MongoDB into a more user friendly form, and setters let you transform user data before it gets to MongoDB.
      // getters DO NOT impact the underlying data stored in MongoDB
      // https://mongoosejs.com/docs/tutorials/getters-setters.html
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
    },
    commentBody: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => dateFormat(createdAt),
    },
    // Associate replies with comments.
    // Note that unlike our relationship between pizza and comment data,
    // replies will be nested directly in a comment's document and not referred to.
    // The replies field populated with an array of data that adheres to the ReplySchema definition.
    replies: [ReplySchema],
  },
  {
    toJSON: {
      // we need to tell the schema that it can use getters.
      // Getters let you transform data in MongoDB into a more user friendly form, and setters let you transform user data before it gets to MongoDB.
      // getters DO NOT impact the underlying data stored in MongoDB
      // https://msongoosejs.cosm/docs/tutorials/getters-setters.html
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

CommentSchema.virtual("replyCount").get(function () {
  return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
