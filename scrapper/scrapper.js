const puppeteer = require("puppeteer");
const Product = require("../models/product");

const scrapeProducts = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = "https://books.toscrape.com/";

    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product-item")).map((item) => ({
            name: item.querySelector(".product-title")?.innerText || "",
            price: item.querySelector(".product-price")?.innerText || "",
            description: item.querySelector(".product-description")?.innerText || "",
            rating: item.querySelector(".product-rating")?.innerText || "",
            url: item.querySelector(".product-link")?.href || "",
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
