const { Pizza } = require("../models");

const pizzaController = {
  // the functions will go here as methods

  // get all pizzas
  getAllPizza: function (req, res) {
    Pizza.find({})
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  getPizzaById({ params }, res) {
    // Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled
    Pizza.findOne({ _id: params.id })
      .then((dbPizzaData) => {
        // If no pizza found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  //------------------*****************---------------------
  // NOTE: the 2 method above(findAll and findOne), were purposefully writtent in different styles,
  // but they accomplish the same goal and there is no functional difference in using 1 over another.
  // See the following example:
  //   const dogObject = {
  //     // this...
  //     bark: function() {
  //       console.log('Woof!');
  //     },
  //     // ... is the same as this
  //     bark() {
  //       console.log('Woof!');
  //     }
  //   }
  //------------------*****************---------------------

  // create pizza
  // The MongoDB _id field isn't just a random combination of characters;
  // it's actually a special data type called ObjectId.
  createPizza({ body }, res) {
    Pizza.create(body) // in mongoose, create() handles both: insert 1 and insert many unlike mongodb(.insertOne(), .insertMany())
      .then((dbPizzaData) => {
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // update pizza by id
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true }) //If we don't set that third parameter, { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document.
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
  //------------------*****************---------------------
  // There are also Mongoose and MongoDB methods called .updateOne() and .updateMany(),
  // which update documents without returning them.
  //------------------*****************---------------------

  // delete pizzaa
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found  with this id" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
  //------------------*****************---------------------
  // Like with updating, we could alternatively use .deleteOne() or
  // .deleteMany(), but we're using the .findOneAndDelete() method because
  // it provides a little more data in case the client wants it.
  //------------------*****************---------------------
};

module.exports = pizzaController;
