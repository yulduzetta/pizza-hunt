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
      required: "You need to provide a pizza name",
      trim: true, // removes leading and trailing spaces in the input
    },
    createdBy: {
      type: String,
      required: "You need to provide author name",
      trim: true, // removes leading and trailing spaces in the input
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
      // With this validation option in place, we provide an array of options
      // that this size field will accept. If a user attempts to enter a pizza size not listed—for example,
      // a size value of "Super Mega Large"—the validation simply won't allow it.
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],

      // If you were to provide a custom error message for the required option here,
      // you wouldn't receive it if you provide a size that isn't listed in the enum option.
      // If you want to provide a custom message for enumerable values,
      // you need to look into implementing the validate option Mongoose lets you use,
      // where you can create a custom function to test the values, just like you did with Inquirer!
      required: true,
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

      // Getters let you transform data in MongoDB into a more user friendly form, and setters let you transform user data before it gets to MongoDB.
      // getters DO NOT impact the underlying data stored in MongoDB
      // https://mongoosejs.com/docs/tutorials/getters-setters.html
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
  // Here we're using the .reduce() method to tally up the total of every comment with its replies.
  // In its basic form, .reduce() takes two parameters, an accumulator and a currentValue.
  // Here, the accumulator is total, and the currentValue is comment.
  // As .reduce() walks through the array, it passes the accumulating total
  // and the current value of comment into the function, with the return
  // of the function revising the total for the next iteration through the array.
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// Now we need to actually create the model to get the prebuilt
// methods that Mongoose provides.
// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
