// Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require('nodemailer');
require("dotenv").config();
const fs = require("fs");

// Constants
const url = "https://www.amazon.com/Apple-2022-10-9-inch-iPad-Wi-Fi/dp/B0BJLXMVMV/ref=sr_1_1_sspa?dib=eyJ2IjoiMSJ9.x37hw5scXMlLBGdXY-8OgxwwuwjAPTL4jNHENCjqcEwctETkKGjX-srETlL983iHTjRx29h-zF9mgbbQX1ourhL-I8TGdUzE4257Oi6GiWXW2CvT3h6jtVO7ad6s1glfjL_6YlLvsG66oB82OYnDXJFbHj4gIJFvELAqoo2O4BE_WZuyjqRnHOey2SuKun3k8-ZjIhukEFdIEAGcKfeD8NCLV8OrvGRu70sd2Eg_o_Q.Q_K0EbaPzX5AOjJpQ1nX2jdzmzEM_aEfdTXxqq-q9aM&dib_tag=se&gad_source=1&gclid=CjwKCAiA0bWvBhBjEiwAtEsoWxMlWvY22a7kG2KX7pDzLHjq4guht0Wo5_yDHp4FZEzInHZOdaQ_RxoChwoQAvD_BwE&hvadid=678728824974&hvdev=c&hvlocphy=9031956&hvnetw=g&hvqmt=b&hvrand=3916497011469732461&hvtargid=kwd-316509572625&hydadcr=13581_13368105&keywords=ipad%27s&qid=1710110347&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1";
const logFilePath = "price_log.txt";

// Product object
const product = {
    name: "",
    currentPrice: "",
    originalPrice: "",
    link: url,
    notificationSent: ''
};

// Function to initate scrape and log of price
async function scrapeAndLog() {
    await scrape(); 
    logPrice(); 
}

// Function to scrape data
async function scrape() {
    try {
        // Fetch data
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
                "Accept-Language": "en-US"
            },
        });

        // Load HTML
        const $ = cheerio.load(data);
        const item = $("div#dp-container");

        // Extract data
        product.name = $(item).find("h1 span#productTitle").text().trim();
        const price = $(item).find(".a-price-whole").first().text().replace(/[,.]/g, "");
        const priceNum = parseInt(price);
        product.currentPrice = priceNum;
        product.originalPrice = product.originalPrice || priceNum;
        product.currentPrice = 5

        // Logic to send email out for lower price
        if (product.currentPrice < product.originalPrice) {
            sendLowerPriceEmail();
            product.notificationSent = "Yes";
        } else {
            product.notificationSent = "No";
        }

    } catch (error) {
        console.log(error);
    }
}

// Function to send email on price change
function sendLowerPriceEmail() {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailDetails = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Price Change',
            text: `The price of ${product.name} changed from $${product.originalPrice} to $${product.currentPrice}. Purchase it at ${product.link}`
        };

        transporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs', err.message);
            } else {
                console.log('Email sent successfully');
                transporter.close();
            }
        });
    } catch (err) {
        console.log('Error Occurs', err.message);
    }
}

// Function to log price change to file
function logPrice() {

    const timestamp = new Date().toLocaleString(); // Format timestamp
    const logEntry = `${timestamp}\t${product.name}\t$${product.originalPrice}\t$${product.currentPrice}\t${product.notificationSent}\n`;

    // Check if the log file exists
    fs.access(logFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, add header row
            fs.appendFileSync(logFilePath, 'Timestamp\tProduct Name\tOriginal Price\tCurrent Price\tNotification Sent\n');
        }

        // Append log entry to file
        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            } else {
                console.log('Price change logged to file');
            }
        });
    });

}

// Scheduled scraping for every 10 seconds for testing but realistically would scrape daily
setInterval(scrapeAndLog, 10000); // 
