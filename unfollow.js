const puppeteer = require('puppeteer');
const idPass = require('./credentials');

let page;
(
    async () => {
        let browser = await puppeteer.launch({
            headless: false, defaultViewport: null,
            args: ["--start-maximized"],
        });

        page = await browser.newPage();
        await page.goto('https://www.instagram.com/accounts/login/');
        // console.log('Instagram opened');
        await page.waitForSelector('.f0n8F input');
        await page.type('input[aria-label="Phone number, username, or email"]',idPass.userName,{delay : 50});
        await page.type('input[aria-label="Password"]',idPass.password,{delay : 70});
        await waitAndClick(page, 'button[type = "Submit"]');
        await waitAndClick(page, 'span[class="_2dbep qNELH"]');
        await waitAndClick(page,'div[class="_7UhW9   xLCgt      MMzan  KV-D4              fDxYl     "]');
        await page.waitForSelector('span[class="g47SY "]')
        let numArr = await page.$$('span[class="g47SY "]');
        let num = await page.evaluate((element) => {return element.textContent},numArr[2]);
        num -= "0";
        console.log(num);
        await numArr[2].click();
        for(let i = 0; i < num; i++){
            setInterval(async()=>{await waitAndClick(page,'button[class="sqdOP  L3NKy    _8A5w5    "]')},5000);
            
            setInterval(async()=>{await waitAndClick(page,'button[class="aOOlW -Cab_   "]')},7000);
        }
        console.log('Work done');
    })();


    function waitAndClick(page, selector) {
        return new Promise(function (resolve, reject) {
            let waitForSelectorPromise = page.waitForSelector(selector, { visible: true });
    
            waitForSelectorPromise.then(function () {
                let clickPromise = page.click(selector, { delay: 10 });
                return clickPromise;
            })
                .then(function () {
                    resolve();
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    }