// We could import the entire mongoose library,
// but we only need to worry about the Schema constructor and model function.
const { Schema, model } = require("mongoose");

const dateFormat = require("../utils/dateFormat");

// So for the most part, this feels a lot like Sequelize.
// We essentially create a schema, using the Schema constructor
// we imported from Mongoose, and define the fields with
// specific data types. We don't have to define the fields,
// as MongoDB will allow the data anyway,
// but for for clarity and usability,
// we should regulate what the data will look like.
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,

      // In programming, a getter is typically a special type of function that
      // takes the stored data you are looking to retrieve and modifies or formats it upon return.
      // Think of it like middleware for your data!
      // To use a getter in Mongoose, we just need to add the key get to the field we are
      // looking to use it with in the schema. Just like a virtual,
      // the getter will transform the data before it gets to the controller(s).
      // Every time we retrieve a pizza, the value in the createdAt field will be
      // formatted by the dateFormat() function and used instead of the default timestamp value.
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
    },
    toppings: [], // can also use Array
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", //it tells the Pizza model which documents to search to find the right comments.
      },
    ],
  },
  {
    toJSON: {
      // we need to tell the schema that it can use virtuals.
      virtuals: true,
      getters: true,
    },
    id: false, //We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  }
);

// Virtuals allow us to add more information to a database response so that
// we don't have to add in the information manually with a
// helper before responding to the API request.
// Virtuals work just like regular functions!

// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Now we need to actually create the model to get the prebuilt
// methods that Mongoose provides.
// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
