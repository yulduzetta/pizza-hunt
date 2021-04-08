const router = require("express").Router();
const {
  addComment,
  addReply,
  removeComment,
  removeReply,
} = require("../../controllers/comment-controller");

router.route("/:pizzaId").post(addComment);

// Remember that the callback function of a route method
// has req and res as parameters, so we don't have to explicitly pass any arguments to addReply.
router
  .route("/:pizzaId/:commentId")
  // This is a PUT route, instead of a POST, because technically we're not creating a new reply resource. Instead, we're just updating the existing comment resource. This is also reflected in the endpoint, because we make no reference to a reply resource.
  .put(addReply)
  .delete(removeComment);

// Again, we're trying to model the routes in a RESTful manner,
// so as a best practice we should include the ids of the parent resources in the endpoint.
// It's kind of like saying, "Go to this pizza, then look at this particular comment,
// then delete this one reply."
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
