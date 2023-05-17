/*
 * Name: Sankalp Patil
 * Email: patilsa@oregonstate.edu
 */

var fs = require('fs');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

//Setting up the templating engine
const app = express();
var port = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs.engine({
  defaultLayout: "defaultPage",
}));


//Ensures that the css and script files are accesible
app.use(express.static('public'));


//Setting up routes
app.use("/users", require("./users.js"));
app.use("/seekers", require("./seekers.js"));
app.use("/tenants_properties", require("./tenants_properties.js"));
app.use("/properties", require("./properties.js"));
app.use("/informationRequests", require("./informationRequests.js"));
app.use("/reviews", require("./reviews.js"));



// //Handles seeing a specific post (NEED TO FIX - don't show filter and the sell something button)
// app.get('/posts/:postNumber', function(req, res, next){
//   var postData = readPosts()
//   var postNumber = parseInt(req.params.postNumber)

//   if(postNumber < postData.length){

//     // console.log(postData.slice(req.params.postNumber - 1,req.params.postNumber))
//     res.status(200)

//     res.render('postsPage', {
//       posts: postData.slice(postNumber,postNumber + 1),
//       wholePage: false
//     })

//   }else{
//     next()
//   }
// })

//Handles 404
app.use(function (req, res) {
  res.status(404)
  res.render('404')
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});


