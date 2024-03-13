# Amazon-Web-Scraper

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#How the application works">How the application works</a></li>
    <li><a href="#How to configure and use the application">How to configure and use the application</a></li>
    <li><a href="#A brief discussion of any challenges faced and how they were overcome">A brief discussion of any challenges faced and how they were overcome</a></li>
    <li><a href="Any additional features implemented beyond the basic requirements and / or any extension to the project that is desired">Any additional features implemented beyond the basic requirements and / or any extension to the project that is desired</a></li>
    <li><a href="#Any details on testing performed as part of the project to ensure the project meets the requirements">Any details on testing performed as part of the project to ensure the project meets the requirements</a></li>

  </ul>
</details>

## How the application works
The application uses setInterval to scrape and log the price of an Amazon iPad 10th Generation with A14 Bionic chip, 10.9-inch Liquid Retina Display, 64GB, Wi-Fi 6, 12MP front/12MP Back Camera, Touch ID, All-Day Battery Life – Blue at a specified interval (current set at 10 seconds).
If the the current price is less than the previous price it will also automatically send out an email to a specified email address. 

## How to configure and use the application

Tools used
- [Axios](https://www.npmjs.com/package/axios)
- [Cheerio](https://cheerio.js.org/docs/intro)
- [nodemailer](https://www.nodemailer.com/)
- [dotenv](https://www.npmjs.com/package/dotenv?activeTab=readme)

## Getting Started

1. Clone this repo or fork to your own repo
2. cd into the directory on your local machine
3. Install dependencies

```
npm install
```

4. node scrapeAndLogAmazon.js

##  A brief discussion of any challenges faced and how they were overcome
#### Puppteer CAPTCHA on Amazon and pivot to Cheerio
  1. I inially decided to use Puppeteer to scrape the price but while using Puppeteer I kept running in to Captcha which would stop the process. 
  2. I researched and explored different plugins and tools that would bypass Captcha such as puppeteer-extra abd puppeteer-extra-plugin-stealth as well as Bright Data.
  3. Since I didn't need to interact with dynamic and JavaScript-Heavy websites, I decided to use try Cheerio. Unlike Puppeteer, Cheerio does not execute JavaScript or render web pages. Instead, it operates on static HTML content retrieved from web pages or other sources.
     
#### Cheerio scraping incorrect price
  1. While using Cheerio, when scraping the price, the price scraped would be the "Save and Used" price instead of the Amazon price listed.
  2. This issue was resolved by passing in User-Agent in the headers of axious get request.
  3. Note: The User-Agent header informs the server about the operating system, vendor, and version of the requesting client. This is relevant because any inconsistencies in the information the website receives can alert it about suspicious bot-like activity, leading to our scrapers getting blocked.

#### Twilio New industry-wide requirements for toll-free messaging and pivot to Nodemailer
  1. I initially planned to use Twilio SMS messaging for my notification but unfortunately as of Jan 1, 2024 there is a "New industry-wide requirements for toll-free messaging". Per Twilio: "Effective January 31, 2024, messages sent from toll-free numbers pending verification will be blocked. Only fully verified toll-free phone numbers will be eligible to send messages. For more information, please check out our guide Toll-Free Message Verification for US/Canada."
  2. This process required an upgraded account and potental days loss for Twilio to review and approve.
  3. Decided to pivot to email and use Nodemailer.

## Extension to the project that is desired
  1. Setting up a NoSQL Database - I don't the data to have structured relationships consistency with strong ACID guarantees 
  2. Making the scraper dynamic to be able to take an input instead of setting the URL only one product specific.
  3. Build UI with a search bar to search a specified product to plug into scrape and log.
  4. Create additional web pages with price change / history chart.

## Any details on testing performed as part of the project to ensure the project meets the requirements
  1. Tests performed was primarily using manual tests and console logs.
