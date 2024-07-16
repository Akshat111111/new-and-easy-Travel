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





//GET
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

app.get("/login",async (req,res)=>{
    try{
        res.render("login.ejs",{});
    }
    catch(error){
        console.log(error.message);
    }
});




//POST
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

app.post("/login",async (req,res)=>
{
    console.log("login route has been hit");
    try{
        let email=req.body.email;
        let pswd= req.body.password;
        let result=await Db.query("select * from users where email = $1",[email]);
        console.log(result.rows);
        if(result.rows.length>0){
            let realpswd = result.rows[0].password;
            if(realpswd==pswd){
                res.render("index.ejs",{username:result.rows[0].name});
            }
            else{
                res.send("<h6>email and password do not match</h6>");
            }
        }
    }
    catch(error){
        console.log(error.message);
    }
});

app.listen(port,()=>console.log("The server has started at port number: "+port));
