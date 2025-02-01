require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const { urlencoded } = require("body-parser");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const shortUrls = {};

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  const parsedUrl = URL.parse(originalUrl);

  dns.lookup(parsedUrl.hostname, (err, address, family) => {
    if (err) {
      return res.json({ error: "Invalid url" });
    }

    const shortUrl = Math.ceil(Math.random() * 1000);

    shortUrls[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl,
    });
  });
});

app.get("/api/shorturl/:shorturl", function (req, res) {
  const shortUrl = req.params.shorturl;

  const originalUrl = shortUrls[shortUrl];

  if (originalUrl) {
    return res.redirect(originalUrl);
  }

  return res.json({ error: "No short URL found for the given input" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
