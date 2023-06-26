import express from "express";
import { request } from "http";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "backend",
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err, "error connecting to database"));

const app = express();

// app.get('/', (req, res) => {
//     res.send("Hi");
// })

// using middlewares
// to setup the static folder after setting this up we can pass the direct path into the res.sendFile function
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs"); // setting up the view engine

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "wqdwwefwefe");
    req.user = await User.findById(decoded._id);
    next();
  } else {
    res.redirect("/login");
  }
};

// we can pass multiple callback here, nex function is used to call the next callback passed
app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });

  // console.log(path.resolve());
  // const pathLocation = path.resolve();
  // const mainPath = path.join(pathLocation,"./index.html");   // these methods are used to render the whole file
  // res.sendFile(mainPath);

  //   res.render("index", { name: "Aakash", lastName: "Sharma" });

  // Basically both sendFile and render method are used to render the whole file but the only difference is that
  // with the render method we can pass the parameters using ejs engine but with the whole file setup we can't do that
});

app.get("/register",(req,res)=>{
  res.render("register");
})

app.get("/login",(req,res)=>{
  res.render("login");
})


// its a post request because we want to pass the data
app.post("/register", async (req, res) => {
  const { name, email,password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }

  const hashedPassword = await bcrypt.hash(password,10);
   user = await User.create({ name, email, password: hashedPassword });

  // jwt is basically used to create some resonable token, it can be decoded as well
  const token = jwt.sign({ _id: user._id }, "wqdwwefwefe");

  // here exprires attribute expire the cookie after the particular time
  // httpOnly attribute make it secure, not allow the client side to nake request
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

// its a get request because we don't want to pass the data
app.get("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.post("/login",async (req,res)=>{
const { email,password } = req.body;
let user = await User.findOne({ email });
if(!user) return res.redirect("/register");
 const isMatch = await bcrypt.compare(password, user.password);
 if(!isMatch) return res.render("login",{email: email,message: "Incorrect Password"});
  
 const token = jwt.sign({ _id: user._id }, "wqdwwefwefe");

 // here exprires attribute expire the cookie after the particular time
 // httpOnly attribute make it secure, not allow the client side to nake request
 res.cookie("token", token, {
   httpOnly: true,
   expires: new Date(Date.now() + 60 * 1000),
 });
 res.redirect("/");
})

// to add data into the database
// basically mongose is used to connect mongodb with the nodejs

// app.get("/add", async (req, res) => {
//   console.log("Add method is called");
//   await Messge.create({ name: "Aakash", email: "aakash@gmail.com" });
//   res.send("Nicely added");
// });
app.listen(5000, () => {
  console.log("server is working");
});
