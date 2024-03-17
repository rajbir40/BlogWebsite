const mongoose = require("mongoose");
let port = 3000;
mongoose.connect("mongodb+srv://gurnoor8520:teradaddy420@cluster0.sffmssb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const zod = require('zod');
const session = require('express-session');

const User = mongoose.model('Users', {name: String, email: String, password: String});
const Blog = mongoose.model('Blogs', {name: String, email: String, title: String, content: String, time: String});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true
}));

let inputIssue = " ";
let data = {};

function validateInput(obj){
    let emailSchema = zod.string().email();
    let passwordSchema = zod.string().min(8);

    console.log(obj.password);
    console.log(obj.email);

    let isPasswordValid = passwordSchema.safeParse(obj.password);
    let isEmailValid = emailSchema.safeParse(obj.email);
    
    console.log(isEmailValid);
    console.log(isPasswordValid);

    if(isEmailValid.success && isPasswordValid.success){
        inputIssue = " ";
        return true;
    }
    else if(!isEmailValid.success){
        inputIssue = "Not a valid Email";
        return false;
    }
    else{
        inputIssue = "Password must be atleast 8 characters long";
        return false;
    }

}

app.get("/", function(req, res){
    res.render('signup', {data});
})

app.get("/signup", function(req, res){
    res.render('signup', {data});
})

app.get("/login/", function(req, res){
    res.render('login', {data});
})

app.get("/index/", async function(req, res){
    data = req.session.data || {};
    if(data.email == undefined){
        return res.render('signup', {data});
    }
    const allBlogs = await Blog.find();
    data.allBlogs = allBlogs;
    return res.render('index', {data});
})

app.get("/create/", function(req, res){
    data = req.session.data || {};
    if(data.email == undefined){
        return res.render('signup', {data});
    }
    return res.render('create', {data});
})

app.get("/update/", async function(req, res){
    data = req.session.data || {};
    if(data.email == undefined){
        return res.render('signup', {data});
    }
    const allBlogs = await Blog.find({email: data.email});
    data.allBlogs = allBlogs;
    return res.render('update', {data});
})

app.post("/", async function(req, res){ 
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(!validateInput(req.body)){
        data.issue = inputIssue;
        return res.render('signup', {data} );
    }

    const existingUser = await User.findOne({email: email});
    if(existingUser){
        inputIssue = "Email already exists. Try Log In";
        data.issue = inputIssue;
        return res.render('signup', {data} );
    }

    const user = new User({ 
        name: name,
        email: email,
        password: password
    });
    
    user.save();

    data.name = name;
    data.email = email;
    req.session.data = data;

    return res.redirect("/index");
})

app.post("/login", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    if(!validateInput(req.body)){
        data.issue = inputIssue;
        return res.render('login', {data} );
    }

    const existingUser = await User.findOne({email: email});
    if(!existingUser){
        inputIssue = "Email doesn't exist. Try sign up";
        data.issue = inputIssue;
        return res.render('login', {data} );
    }

    if(password === existingUser.password){
        data.name = existingUser.name;
        data.email = existingUser.email;
        req.session.data = data;
        return res.redirect("/index");
    }
    else{
        inputIssue = "Incorrect password";
        data.issue = inputIssue;
        return res.render('login', {data} );
    }

})

app.post("/create", async function(req, res){
    const title = req.body;
    console.log(title);

    console.log(req.session.data);

    const blog = new Blog({ 
        name: req.session.data.name,
        email: req.session.data.email,
        title: req.body.title,
        content: req.body.content,
        time: req.body.date
    });
    
    blog.save();

    return res.send("Done");
})

app.delete("/update", async function(req, res){
    const deletedDocument = await Blog.findOneAndDelete( {time:req.body.time} );
    console.log(deletedDocument);
    res.send("deleted");
})

app.listen(port, ()=>{
    console.log("listening...");
});
