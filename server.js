const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080;
const path = require('path');
const request = require('request');
// const cookieSession = require("cookie-session");
// const uuidv1 = require('uuid/v1');

// app.use(cookieSession({
//   name: 'session',
//   keys: ['banana'],
//   maxAge: 24 * 60 * 60 * 1000 })
// );
  
  // app.use(cookieSession({
  //   name: "cookies",
  //   keys: ["user_id"]
  // }));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


app.use(express.static('dist'));
app.use('/build', express.static('build'));


// Fake Database
var Userid = 1;

const users = {
  1: {
    id: 1,
    name: "Shark",
    email: "test@test.com",
    password: "2"
  },
}
//example request
// request('http://10.30.33.169:7000/api?/walmart/name=something', function (error, response, body) {
//   res.send(body);
// }

// View routes (static, to do: use variables)
app.get("/", (req, res) => {
  res.redirect("/main");
});

app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/user_id", (req, res) => {
  // if(!req.session.user_id){
  //   res.redirect("/register");
  //   return;
  // }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/user_id/lists", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/user_id/list_id", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/logout", (req, res) => {
  // res.redirect("/login");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", (req, res) => {
  var registerfailed = false;

  if(req.body.password !== req.body.confirmPassword || req.body.email === "" || req.body.name === ""){
    registerfailed = true;
  }
  for(var user in users) {
    if(users[user].email === req.body.email){
      registerfailed = true;
    }
  }

  if(registerfailed){
    res.send({message: "Register Failed."});
  }
  // set the cookies here
  else {
    Userid += 1;
    // req.session.user_id = Userid;
    users[Userid] = {
      id: Userid,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    // res.send(users[req.session.user_id]);
    // res.json()
    res.json(users[Userid].id);
    // res.redirect('/');
  }
});

app.post("/login", (req, res) => {
  let loginfailed = true;
  let user_id = null;

  for(var user in users) {
    if(users[user].email === req.body.email){
      if(users[user].password === String(req.body.password)){
        loginfailed = false;
        user_id = users[user].id;
      }
    }
  }

  if(loginfailed){
    res.send( {message: "Your email and password did not match our records, please try again."} );
    return;
  }
  console.log("user_id is " + user_id);
  res.json(user_id);

});

app.post("/logout", (req, res) => {
  // req.session = null;
  res.redirect("/login");
});
// Test routes
// app.get("/test", (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.get("/sam", (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// })


// Data routes
app.get('/turtles', (req, res) => {
  // res.send({ turtles: ['turtle', 'different turtle'] })
  res.send({ turtles: ['🐢', '🐢', '🐢', '🐢', '🐢'] })
});

// app.post('/:user_id/lists,' (req, res) => {
//   //Add a record to lists database
// });

app.post("/search", (req, res) => {
  // console.log("in search " + req.body);
  // console.log("in search " + req.body.item);
  let item = req.body.item;
  // let results = [];
  
  request("http://192.168.88.120:7000/products?name=" + item, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    // body.forEach(function(i){
    //   results.push(body[i].name)
    // });
    // res.send(results);
    let string = JSON.parse(body);
    res.send(string[0].name)
  });

  // res.send(product);
  // res.send(responseJson);

});

app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});
