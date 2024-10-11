const express = require('express');

const app = express();


app.use('/test',(req,res)=> {
    res.end('Testing');
})

app.use("/hello",(req,res)=> {
    res.end("Hey from dev");
})

app.listen(7777,()=> {
    console.log("Listening server on port 7777...");
});