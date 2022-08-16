#!usr/bin/env node

const async = require('async');
const Message = require("./models/messageModel");
const User = require('./models/userModel');

const userArgs = process.argv.slice(2);

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

const users = [];
const messages = [];

function userCreate(username, password, member, admin, cb) {
  let userdetail = {
    username: username,
    password: password,
    member: member,
    admin: admin,
  };
  const user = new User(userdetail);

  user.save((err) => {
    if (err) return cb(err, null);
    console.log(`New User: ${user}`);
    users.push(user);
    return cb(null, user);
  });
}

function messageCreate(text, timestamp, cb) {
  const someMessage = {
    text: text,
    timestamp: timestamp
  };

  const message = new Message(someMessage);
  message.save((err) => {
    if (err) return cb(err, null);
    console.log(`New Message: ${message}`);
    messages.push(message);
    return cb(null, message);
  });
}

function createUsers(cb) {
  async.series([
    function(callback) {
      userCreate( "CoolMan", "K2Vw@PQvV-nMS_Rf", false, false, callback);
    },
    function(callback) {
      userCreate("goodLookingGuy", "@4JFDq*-u^5uy!", false, false, callback);
    },
  ], cb);
}

function createMessages(cb) {
  async.series([
    function(callback) {
      messageCreate("I have a dream!", Date.now(), callback);
    },
    function(callback) {
      messageCreate("Numbaaa 5!!", Date.now(), callback);
    },
  ], cb);
}

async.series([
  createUsers,
  createMessages,
], (err, results) => {
  if (err) { 
    console.log(`FINAL ERR: ${err}`);
  } else {
    console.log(`Success: ${results}`);
  }
  mongoose.connection.close();
});