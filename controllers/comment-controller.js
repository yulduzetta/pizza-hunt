const { Pizza, Comment } = require("../models");

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },

          // The $push method works just the same way that it
          // works in JavaScript—it adds data to an array.
          // All of the MongoDB-based functions like $push start with a dollar sign ($),
          // making it easier to look at functionality and
          // know what is built-in to MongoDB and what is a custom noun the developer is using.
          { $push: { comments: _id } },

          // We're also returning the pizza Promise here so that we can
          // do something with the results of the Mongoose operation.
          // Again, because we passed the option of new: true,
          // we're receiving back the updated pizza (the pizza with the new comment included).
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  // remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deleteComment) => {
        if (!deleteComment) {
          return res.json(404).json({ message: "No comment with this id!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },

          // remove it from the associated pizza
          { $pull: { comments: params.commentId } },

          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this  id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
