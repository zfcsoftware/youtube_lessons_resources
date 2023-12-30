
const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, ms);
    })
}


const checkStat = ({ page }) => {
    return new Promise(async (resolve, reject) => {
        var st = setTimeout(() => {
            resolve({
                code: 1
            })
        }, 3000);
        try {
            var checkStat = await page.evaluate(() => {
                var stat = 0
                if (document.querySelector('html')) {
                    var html = document.querySelector('html').innerHTML
                    html = String(html).toLowerCase()
                    if (html.indexOf('challenges.cloudflare.com/turnstile') > -1) {
                        stat = 1
                    }
                } else {
                    stat = 2
                }
                return stat
            });
            if (checkStat !== 0) {
                try {
                    var frame = page.frames()[0]
                    await page.click('iframe')
                    frame = frame.childFrames()[0]
                    if (frame) {
                        await frame.hover('[type="checkbox"]').catch(err => { })
                        await frame.click('[type="checkbox"]').catch(err => { })
                    }
                } catch (err) { }
            }
            clearInterval(st)
            resolve({
                code: checkStat
            })

        } catch (err) {
            clearInterval(st)
            resolve({
                code: 1
            })
        }
    })
}


const send = ({ url = '', proxy = {} }) => {
    return new Promise(async (resolve, reject) => {
        try {
            var { puppeteerRealBrowser } = await import('puppeteer-real-browser')
            var data = {}
            if (proxy && proxy.host && proxy.host.length > 0) {
                data.proxy = proxy
            }
            puppeteerRealBrowser = await puppeteerRealBrowser(data)
            var browser = puppeteerRealBrowser.browser
            var page = puppeteerRealBrowser.page
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded' })

                var stat = await checkStat({
                    page: page
                })

                while (stat.code !== 0) {
                    await sleep(500)
                    stat = await checkStat({
                        page: page
                    })
                }
                resolve({
                    code: 200,
                    message: 'OK',
                    data: {
                        browser: browser,
                        page: page
                    }
                })

            } catch (err) {
                await browser.close()
                resolve({
                    code: 501,
                    message: err.message
                })
            }

        } catch (error) {
            resolve({
                code: 500,
                message: error.message
            })
        }

    })
}



send({
    url: '<url>',
    // proxy: {
    //     host: '<host>',
    //     port: '<port>',
    //     username: '<username>',
    //     password: '<password>',
    // }
})
.then(resp=>{
    console.log(resp);
})