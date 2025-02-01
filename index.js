const express= require('express');

const app= express();

const PORT=7777;

app.listen(PORT,(err)=>{
    if(err){
        console.log('Error in starting server');
    }
    else{
        console.log('Server started on port no:',PORT);
    }
})