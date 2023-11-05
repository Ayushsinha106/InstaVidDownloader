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


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
  console.log("app is working")
});

app.post('/submit', async (req, res) => {
  const textInput = req.body.textInput;
  console.log('Received input:', textInput);
  const data = await getVid(textInput);
  res.render('index', data)  
});



const port = process.env.PORT || 9000

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
