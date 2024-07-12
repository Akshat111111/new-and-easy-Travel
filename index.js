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

app.get('/', (req, res) => {
    res.render('contact');
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

app.post('/submit-contact-form', (req, res) => {
    const { name, email, message } = req.body;

    // Validate form data
    if (name.length < 3) {
        return res.status(400).send('Your name should be at least 3 characters long.');
    }
    if (!(email.includes('.') && email.includes('@'))) {
        return res.status(400).send('Please enter a valid email address.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send('Please enter a valid email address.');
    }
    if (message.length < 15) {
        return res.status(400).send('Please write a longer message.');
    }

    // Process the form data (e.g., save to database, send email)
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

    // Send a success response
    res.send('Thank you! I will get back to you as soon as possible.');
});

app.listen(port,()=>console.log("The server has started at port number: "+port));