// create variable to hold db connnection
let db;

// Establish a conn to IndexDB d/b called 'pizza_hunt'
// and set it to the version 1

// Acts as an event listener for the database which
// is creatted when we open the conn to the db using the indexedDb.open() method

// As part of tthe browser's window object, indexedDB is a global variable.
// The .open() takes 2 params:
// 1. name of the db you want to create or  connect to
// 2. the version of the db, by default, starts w/ 1 -- used to determine if the db structure has changed between connections.
const request = indexedDB.open("pizza_hunt", 1);

// indexedDB itself does not hold the data
// The container that stores the data is called an 'object store'.
// We can't create an object store until the conn to the db is open, emitting the event that the request var will be able to capture.

// this event will emit if the db version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  // save a ref to the db
  const db = event.target.result;

  //create an object store (table) called 'new pizza', set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

// Upon a successful request
// We set it up so that when we finalize the connection to the database,
// we can store the resulting database object to the global variable db we created earlier.

// This event will also emit every time we interact with the database,
// so every time it runs we check to see if the app is connected to the internet network.
// If so, we'll execute the uploadPizza() function.
request.onsuccess = function (event) {
  // when db is successfully created with its object  store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes, run uploadPizza() function  to send  all  local b to api
  if (navigator.onLine) {
    uploaPizza();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

// With IndexedDB, we don't always have that direct connection like we do with SQL
// and MongoDB databases, so methods for performing CRUD operations with IndexedDB
// aren't available at all times. Instead, we have to explicitly open a transaction,
// or a temporary connection to the database.
// This will help the IndexedDB database maintain an accurate reading of the data it stores so that data isn't in flux all the time.

// This saveRecord() function will be used in the add-pizza.js file's
// form submission function if the fetch() function's .catch() method is executed.

// This function will be executed if we attempted to submit a new pizza and there is no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write persmissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access the object store for new pizza
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add recored to your store  with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a variable
  // Because the object stores can be used for both small and large file storage,
  // the .getAll() method is an asynchronous function that we have to attach
  // an event handler to in order to retrieve the data. Let's add that next.
  const getAll = pizzaObjectStore.getAll();

  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}
// Here, we instruct the app to listen for the browser regaining internet connection using the online event.
// If the browser comes back online, we execute the uploadPizza() function automatically.
// listen for app coming back online
window.addEventListener("online", uploadPizza);
