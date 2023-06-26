// const gfName = require("./features");
// const http = require('http');

// as now we modify the type in package.json to module type so we can use the import keyword now
import http from "http";
import gfname, { gfName2, gfName3 } from "./features.js";
import * as myObj from "./features.js";
import fs from "fs";

console.log({ gfname, gfName2, gfName3 });
// console.log(myObj.lovePercent());

// in synchronous function it wait till the file gets laaded 
const home = fs.readFileSync("./index.html");

const server = http.createServer((req, res) => {
  console.log(req.url);
  if (req.url === "/about") {
    res.end(`<h1>Love is ${myObj.lovePercent()}</h1>`);
  } else if (req.url === "/contact") {
    res.end("<h1>Contact Page</h1>");
  } else if (req.url === "/") {
    // fs.readFile("./index.html", (err, data) => {
    //   if (err) console.log(err);               // asychronous way of doing this 
    //   else res.end(data);
    // });
    res.end(home);
  } else {
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(5000, () => {
  console.log("server is working");
});
