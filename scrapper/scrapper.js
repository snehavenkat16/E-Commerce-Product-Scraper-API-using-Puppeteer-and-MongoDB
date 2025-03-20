const puppeteer = require("puppeteer");
const Product = require("../models/product");

const scrapeProducts = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = "https://books.toscrape.com/";

    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product_pod")).map((item) => ({
            name: item.querySelector("h3 a")?.getAttribute("title") || "",
            price: item.querySelector(".price_color")?.innerText || "",
            rating: item.querySelector(".star-rating")?.classList[1] || "", 
            url: item.querySelector(".image_container a")?.href || ""
        }));
    });
    

    for (const product of products) {
        await Product.findOneAndUpdate(
            { url: product.url },
            { ...product, updatedAt: new Date() },
            { upsert: true }
        );
    }
    await browser.close();
};

module.exports = scrapeProducts;
