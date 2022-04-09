const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb+srv://admin-nour:admin@cluster0.nhj1z.mongodb.net/blog?retryWrites=true&w=majority")

const postSchema = new mongoose.Schema({
  name: String,
  content: String
});

const Post = mongoose.model("post", postSchema)

app.get("/", function(req, res) {
  Post.find((err, ps) => err ? console.log(err) : res.render("home", {posts: ps}));
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", async function(req, res) {
    const p = new Post ({
        name: req.body.postTitle,
        content: req.body.postBody
    })
    p.save((err) => err ? console.log(err) : res.redirect("/"));
});

app.get("/dev", function(req, res) {
    Post.find((err, ps) => err ? console.log(err) : res.render("dev", {posts: ps}))
});

app.post("/dev", function(req, res) {
    Post.deleteOne({name:req.body.title}, (err) => err ? console.log(err) : res.redirect("/dev"))
});

app.get("/posts/:postName", function(req, res) {
    const requestedTitle = _.capitalize(req.params.postName);
    Post.findOne({name: requestedTitle}, (err, ps) => err ? console.log(err) : res.render("post", {postTitle: ps.name, postContent: ps.content}));
});

app.get("/edit/:postName", function(req, res) {
    const requestedTitle = _.capitalize(req.params.postName);
    Post.findOne({name: requestedTitle}, (err, ps) => err ? console.log(err) : res.render("edit", {editTitle: ps.name, editContent: ps.content}));
});

app.post("/edit/:postName", function(req, res) {
    const requestedTitle = _.capitalize(req.params.postName);
    Post.updateOne({name: requestedTitle}, {name:req.body.editedTitle, content:req.body.editedContent}, (err, result) => err ? console.log(err) : res.redirect("/"));
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started");
});
