const puppeteer = require("puppeteer");

const url = "https://www.amazon.in/XG-Brand-Special-Mahindra-Thar/dp/B083RW75WZ/ref=asc_df_B083RW75WZ/?tag=googleshopdes-21&linkCode=df0&hvadid=709989930380&hvpos=&hvnetw=g&hvrand=861721144859462045&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1007768&hvtargid=pla-1371189208781&psc=1&mcid=e0fafb14c90e3becbca312d2f4fb2030&tag=googleshopdes-21&linkCode=df0&hvadid=709989930380&hvpos=&hvnetw=g&hvrand=861721144859462045&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1007768&hvtargid=pla-1371189208781&psc=1&gad_source=1"; // Replace with your target URL

const scrapeText = async () => {
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true, // Set to false if you want to see the browser
  });

  const page = await browser.newPage();

  // Set a reasonable viewport
  await page.setViewport({ width: 1200, height: 800 });

  // Go to the page and wait until network is idle (all resources loaded)
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait a bit more for dynamically loaded content (if any)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract visible text
  const text = await page.evaluate(() => {
    // Remove unwanted tags
    document.querySelectorAll("script, style, noscript").forEach(el => el.remove());

    // Get visible text and normalize whitespace
    return document.body.innerText.replace(/\s+/g, " ").trim();
  });

  console.log(text);

  await browser.close();
};

// Run the scraper
scrapeText();


/*
const puppeteer = require("puppeteer");
const duckdb = require("duckdb");

const url = "https://webscraper.io/test-sites/e-commerce/allinone";

// Connect to your existing DuckDB file
const db = new duckdb.Database("sdtdb.duckdb");
const con = db.connect();

const scrapeText = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait for dynamic content

    // Extract text + title
    const { text, title } = await page.evaluate(() => {
      document.querySelectorAll("script, style, noscript").forEach(el => el.remove());
      return {
        text: document.body.innerText.replace(/\s+/g, " ").trim(),
        title: document.title
      };
    });

    console.log("Scraped page title:", title);

    // Insert into DuckDB table
    con.run(
      `INSERT INTO scraped_pages (url, title, raw_text) VALUES (?, ?, ?)`,
      [url, title, text],
      (err) => {
        if (err) {
          console.error("DB insert error:", err);
        } else {
          console.log("✅ Inserted into DuckDB (sdtdb.duckdb)");
        }

        // Close the connection after insertion
        con.close((closeErr) => {
          if (closeErr) console.error("Error closing connection:", closeErr);
          else console.log("Connection closed.");
        });
      }
    );

    await browser.close();
  } catch (err) {
    console.error("Error scraping page:", err);
  }
};

// Run the scraper
scrapeText();
*/
