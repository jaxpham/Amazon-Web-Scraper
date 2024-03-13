# Amazon-Web-Scraper

## How the application works
The application uses setInterval to scrape and log the price of an Amazon iPad 10th Generation with A14 Bionic chip, 10.9-inch Liquid Retina Display, 64GB, Wi-Fi 6, 12MP front/12MP Back Camera, Touch ID, All-Day Battery Life – Blue at a specified configurable interval (currenttly set at 10 seconds).
If the the current price is less than the previous price it will also automatically send out an email notification. 

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

```bash
npm install
```

4. Create a new file named `.env` in the root of your project and add the following content (gmail password must be generated for app specific):

```env
EMAIL_SERVICE = 'gmail'
EMAIL_USER = <your_email_address>
EMAIL_PASS = <your_email_password>
```

5. Run the application

```bash
node scrapeAndLogAmazon.js
```

##  A brief discussion of any challenges faced and how they were overcome

#### Puppteer CAPTCHA on Amazon and pivot to Cheerio
  1. I inially decided to use Puppeteer to scrape the price but while using Puppeteer I kept running into Captcha which would stop the process. 
  2. I researched and explored different plugins and tools that would bypass Captcha such as puppeteer-extra and puppeteer-extra-plugin-stealth as well as Bright Data but ultimately decided to pivot to using Cheerio.
  3. I didn't need to interact with dynamic and JavaScript-Heavy websites, so Cheerio made sense. Unlike Puppeteer, Cheerio does not execute JavaScript or render web pages. Instead, it operates on static HTML content retrieved from web pages or other sources.
     
#### Cheerio scraping incorrect price
  1. While using Cheerio, when scraping the price, the price scraped would be the "Save and Used" price instead of the Amazon price listed.
  2. This issue was resolved by passing in User-Agent in the headers of Axios get request.
  3. Note: The User-Agent header informs the server about the operating system, vendor, and version of the requesting client. This is relevant because any inconsistencies in the information the website receives can alert it about suspicious bot-like activity, leading to our scrapers getting blocked.

#### Twilio New industry-wide requirements for toll-free messaging and pivot to Nodemailer
  1. I initially used Twilio SMS messaging for my notification but unfortunately as of Jan 1, 2024 there is a "New industry-wide requirements for toll-free messaging". Per Twilio: "Effective January 31, 2024, messages sent from toll-free numbers pending verification will be blocked. Only fully verified toll-free phone numbers will be eligible to send messages." This process required an upgraded account and verification which required Twilio to review and approve.
  2. Decided to pivot to email notification via Nodemailer.

## Future extensions to the project that is desired
  1. Setting up a NoSQL Database - The data does not need to have structured relationships and or consistency with strong ACID guarantees so NoSQL Database would make sense.
  2. Setting the scraper to accept parameter(s) to make it dynamic instead of just setting the URL for one specific product.
  3. Build UI to search specified product(s) to scrape, log, and track price changes.
  4. Create UI pages displaying price changes / history.

## Any details on testing performed as part of the project to ensure the project meets the requirements
  1. Tests performed was primarily using manual testing.
