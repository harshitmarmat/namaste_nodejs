const express = require('express');

const app = express();


app.get('/user/:user_id',(req,res)=>{
    console.log(req.params);
    console.log(req.query);
    res.send("Get User data")
})

app.post("/user",(req,res)=>{
    res.send("Post User data")
})

app.patch("/user",(req,res)=>{
    res.send("Patch User data");
})

app.delete("/user",(req,res)=> {
    res.send("Delete User data");
})

// app.use("/test2",(req,res)=> {
//     res.end("test2")
// })
// app.use('/test',(req,res)=> {
//     res.end('Testing');
// })

// app.use("/hello",(req,res)=> {
//     res.end("Hey from dev");
// })

app.listen("7777",()=> {
    console.log("Listening server on port 7777...");
});