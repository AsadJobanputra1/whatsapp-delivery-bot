const puppeteer = require('puppeteer');
// If pupeteer environment isn't running or configured correctly, then use this utility to help troubleshoot
// pupeteer has an executablePath: '$HOME/.cache/puppeteer/chrome', strategy that can be used if you have multiple
// browser enviornments running.
(async () => {
  // Launch a browser instance
  const browser = await puppeteer.launch();
  
  // Open a new page in the browser
  const page = await browser.newPage();
  
  // Navigate to a website (e.g., https://example.com)
  await page.goto('https://google.com');
  
  // Take a screenshot of the page
  await page.screenshot({ path: 'example.png' });

  console.log('Screenshot saved as example.png');
  
  // Close the browser
  await browser.close();
})();
