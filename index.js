import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";

const app = express();
const port = 3000;

const Db = new pg.Client({
    database:"Users_newAndEasyTravel",
    password:"aditya",
    user:"postgres",
    port:5432,
    host:"localhost",
})

Db.connect();

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
    res.render("register.ejs",{});
});

app.get("/login",(req,res)=>{
    console.log("login route has been hit");
    
});


app.post("/register",async(req,res)=>{
    try{
        console.log("register post hit");
        let email = req.body.email;
        let Name = req.body.Name;
        let pswd = req.body.password;
        
        let checkDb= await Db.query("select * from users where email= $1",[email]);
        if(checkDb.rows.length>0){
            res.send("<h6>Email already registered</h6>");
           
        }
        else{
            let result= await Db.query("INSERT INTO users (email,password,name) values ($1,$2,$3)",[email,pswd,Name]);
            console.log(result);
            res.render("index.ejs",{username:Name});
        }
    }
    catch(error){
        console.log(error.message);
    }
});


app.listen(port,()=>console.log("The server has started at port number: "+port));