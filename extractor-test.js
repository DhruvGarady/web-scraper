require("dotenv").config();
const puppeteer = require("puppeteer");
const mysql = require("mysql2/promise");

const url = "https://www.amazon.in/XG-Brand-Special-Mahindra-Thar/dp/B083RW75WZ/";

const scrapeAndSave = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const text = await page.evaluate(() => {
    document.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
    return document.body.innerText.replace(/\s+/g, " ").trim();
  });

  console.log("Scraped text length:", text.length);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  await connection.execute(
    "INSERT INTO scraped_pages (url, page_text) VALUES (?, ?)",
    [url, text]
  );

  console.log("✅ Data inserted into scraped_pages");
  await connection.end();
};

scrapeAndSave().catch(console.error);

