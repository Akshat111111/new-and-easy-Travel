import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = 3000;

//middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    try{
        res.render("intro.ejs");
    }
    catch(error){
        console.log(error.message);
    }
});


app.get("/register",(req,res)=>{
    console.log("register has been hit")
    res.render("register.ejs",{});
});

app.get("/login",(req,res)=>{
    console.log("login route has been hit");
    res.render("login.ejs",{});
});


app.post("/register",(req,res)=>{
    //if
    res.render("index.ejs");
})


app.listen(port,()=>console.log("The server has started at port number: "+port));