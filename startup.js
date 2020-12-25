const puppeteer = require('puppeteer');

(async () => {
   const browser = await puppeteer.launch({
      'args': [
         // '--disable-web-security',
         // '--allow-http-screen-capture',
         // '--allow-running-insecure-content',
         // '--disable-features=site-per-process',
         // '--no-sandbox',
         '--start-maximized'
      ],
      executablePath: 'C:\\Users\\luha000\\AppData\\Local\\360Chrome\\Chrome\\Application\\360chrome.exe',
      // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false,
      slowMo: 20,
      // defaultViewport: {
      //    width:1920,
      //    height:1080
      // }
      defaultViewport: null
   });

   browser.on('targetcreated', async (target) => {
      const newPage = await target.page()
      await newPage.on('load', async () => {
         console.log('newPage--', newPage.url());
         if (newPage.url().indexOf('https://item.jd.com/') >= 0) {
            await newPage.click('#InitCartUrl');
         }
      })
   })

   const page = await browser.newPage();//打开一个空白页
   await page.on('load', async () => {
      if (page.url() === 'https://passport.jd.com/new/login.aspx') {
         await page.click('.login-tab.login-tab-r')
         // await page.type('input[name="loginname"]', '');
         // await page.type('input[name="nloginpwd"]', '');
         // await page.click('.btn-img.btn-entry');
      }

      // if (page.url().indexOf('https://i.taobao.com/my_taobao.htm') >= 0) {
      //    console.log('登录成功');
      //    await page.goto('https://www.taobao.com')
      // }

      if (page.url() === 'https://www.jd.com/') {
         await page.type('input[clstag="h|keycount|head|search_c"]', '手机');
         await page.click('button[clstag="h|keycount|head|search_a"]');
      }

      if (page.url().indexOf('https://search.jd.com/Search?keyword') >= 0) {
         let items = await page.$$('div.gl-i-wrap');

         for (const item of items) {
            let price = await item.$eval('.p-price i', price => price.innerHTML)

            console.log('price', price);

            if (price && Number(price) <= 1999) {
               let link = await item.$('a')
               await link.click();
               // break;
            }
         }
      }
   });
   await page.goto('https://www.jd.com', { 'timeout': 10000 * 20 });//打开淘宝登陆网站
   // await page.goto('https://passport.jd.com/new/login.aspx', { 'timeout': 10000 * 20 });//打开淘宝登陆网站
})();
