const express = require("express")
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser")
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const puppeteer = require("puppeteer");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.set('view engine', 'ejs');

const newUrl = "https://www.instagram.com/reel/ClqvY_sNuhJ/?igshid=MzRlODBiNWFlZA%3D%3D"

const getVid = async (url) => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto(url);
  
  await page.waitForSelector('video');
  const vidEle = await page.$('video')
  const vidContainer = await page.evaluate(video => video.getAttribute('src'), vidEle)
  const pageTitle = await page.title()
  // pageTitle.split(" ").join("_")
  
  
  const data = {
    vidContainer: vidContainer,
    pageTitle:pageTitle,
  }
  
  
  await browser.close();
  return {
    vidContainer: vidContainer,
    pageTitle:pageTitle,
  }
};


app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
  const textInput = req.body.textInput; // This corresponds to the "name" attribute in the form input
  console.log('Received input:', textInput);
  const data = await getVid(textInput)
  res.render('index', data)
});



const port = process.env.PORT || 9000

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
