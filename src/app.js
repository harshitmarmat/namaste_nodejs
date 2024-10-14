const express = require("express");
const {AdminAuth,UserAuth} = require("./middlewares/auth")
const app = express();


// In this commit we have seen how to use middleware. and difference between use and get
// app.use => if the path matches it will get executed on all http method requests (make sure it should be at top level or according to your usecase)


app.use('/admin',AdminAuth); 

app.get('/admin/getAllData',(req,res)=>{
  res.send("All Data")
})

app.get('/admin/deleteUser',(req,res)=>{
  res.send("delete User Data.")
})


app.get('/user/getUser',UserAuth,(req,res)=>{
  res.send("Get User Data.")
})

app.post('/user/createUser',(req,res)=>{
  res.send("Create User.")
})

app.listen("7777", () => {
  console.log("Listening server on port 7777...");
});
