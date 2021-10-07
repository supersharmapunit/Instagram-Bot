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
        await waitAndClick(page, 'span[class="TqC_a"]');
        await page.type('input[type = "text"]','#delhi',{delay:10});
        await waitAndClick(page, '.-qQT3');
        
        // await waitTillHTMLRendered(page); // loading stops
        // await page.waitForSelector('div[data-visualcompletion="loading-state"]',{visible : true});
        // // for(let i = 0; i < 3; i++){
        //     await page.click('div[data-visualcompletion="loading-state"]'); // loading start
        //     await page.click('div[data-visualcompletion="loading-state"]'); // loading start
            
    
        // // }
        await page.waitForSelector('.v1Nh3.kIKUG._bz0w a',{visible:true});
        let postArr = await page.$$('.v1Nh3.kIKUG._bz0w a');
        console.log(postArr.length);
        setTimeout(()=>{},3000);
        // for(let i = 0; i < postArr.length; i++){
            let pagelink = await page.$eval('.v1Nh3.kIKUG._bz0w a', el => el.getAttribute('href'));
            console.log(pagelink);
            let newLink = `https://www.instagram.com${pagelink}`;
            // likeFollowObj.fn(browser, newLink);
            let newPage = await browser.newPage();
            await newPage.goto(newLink);
            await waitAndClick(newPage, '.bY2yH button');
            await waitAndClick(newPage, '.QBdPU svg[aria-label="Like"]');
            await newPage.evaluate(() => window.stop());
            await waitAndClick(newPage,'a[class="zV_Nj"]');
            for(let i = 0; i < 50; i++){
                await waitAndClick(newPage,'button[class="sqdOP  L3NKy   y3zKF     "]');
            }

            // console.log(likePage);
            // setTimeout(()=>{},3000);
            // newPage.waitForSelector('div[class="RnEpo Yx5HN      "]', {visible:true});
            
            
            

        


        // }
        
    }
)();


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

const waitTillHTMLRendered = async (page, timeout = 10000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;

        // console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await page.waitFor(checkDurationMsecs);
    }
};

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}