// We could import the entire mongoose library,
// but we only need to worry about the Schema constructor and model function.
const { Schema, model } = require("mongoose");

// So for the most part, this feels a lot like Sequelize.
// We essentially create a schema, using the Schema constructor
// we imported from Mongoose, and define the fields with
// specific data types. We don't have to define the fields,
// as MongoDB will allow the data anyway,
// but for for clarity and usability,
// we should regulate what the data will look like.
const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: String,
    default: "Large",
  },
  toppings: [], // can also use Array
});

// Now we need to actually create the model to get the prebuilt
// methods that Mongoose provides. 
// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
