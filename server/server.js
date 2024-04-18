const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
// const dbClient = require("./client/dbClient");

const app = express();

// Serve the static files (HTML, CSS, JS) from the public folder
app.use(express.static("public"));
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.json({
//   limit: '50mb',
//   // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
//   verify: function(req,res,buf) {
//       var url = req.originalUrl;
//       if (url.startsWith('/payment/stripePaymentWebhook')) {
//           req.rawBody = buf.toString()
//       }
//   }}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.options("*", cors());

const productsRoutes = require("./routes/productsRoutes");
app.use("/products", productsRoutes);



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Load the SSL certificate and private key
const privateKey = fs.readFileSync("./cert/key.pem", "utf8");
const certificate = fs.readFileSync("./cert/cert.pem", "utf8");

// Create an HTTPS server
const server = https.createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
);
const port = 3000;

// Start the server
server.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
