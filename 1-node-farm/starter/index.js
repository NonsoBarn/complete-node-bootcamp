const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

///////////////
/// FILES

// // ********Synchronous blocking way ********
// // Read file
// const textIn = fs.readFileSync("txt/input.txt", "utf-8");
// // console.log(textIn);

// // Create file
// const textOut = ` This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("txt/output.txt", textOut);
// // console.log("File written");

// // ********Asynchronous non-blocking way ********
// // ***Read file
// fs.readFile("txt/start.txt", "utf-8", (err, data) => {
//   //   console.log(data);
// });

// //
// fs.readFile("txt/start.txt", "utf-8", (err, data1) => {
//   // ***handling error
//   if (err) return console.log("Error");
//   fs.readFile(`txt/${data1}.txt`, "utf-8", (err, data2) => {
//     // console.log(data2);
//     fs.readFile("txt/start.txt", "utf-8", (err, data1) => {
//       fs.readFile(`txt/append.txt`, "utf-8", (err, data3) => {
//         console.log(data3);

//         // ***write file
//         fs.writeFile("txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//           console.log("your file has been written");
//         });
//       });
//     });
//   });
// });

//////////////////////////////
///// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//sending a plain text response.
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //   res.end("Hello from the server");

  //   routing
  //   overiew page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    //   console.log(productData);

    // not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
