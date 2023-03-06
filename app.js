//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const statics = require('./statics')


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = {
  title: String,
  postBody: String
}

const Post = mongoose.model("Post", postSchema);

async function getPosts(){
  try{
    const allPosts = await Post.find({})
    return allPosts;
  }catch(err){
    console.log(err)
  }
}
 
app.get('/', async (req, res)=>{
  const posts = await getPosts()
  res.render('home', {home: statics.homeStartingContent, posts})
})

app.get('/about', (req, res)=>{
  res.render('about', {about: statics.aboutContent})
})
app.get('/contact', (req, res)=>{
  res.render('contact', {contact: statics.contactContent})
})

app.get('/compose', (req, res)=>{
  res.render('compose')
})

app.get('/posts/:title', async (req, res)=>{
  const title = req.params.title.replace(/-/g, ' ')
  const post = await Post.findOne({title}).exec()
  if(post){
    res.render("post", {title: post.title, body: post.postBody})
  }else{
    res.render("error")
  }
})

app.post('/', (req, res)=>{
  const {title, postBody} = req.body
  const post = new Post({
    title, postBody
  })
  post.save()
  res.redirect("/")

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
