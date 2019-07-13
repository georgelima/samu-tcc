const puppeteer = require('puppeteer')

const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/a0e134c3-098b-48a7-9f00-ebd377dc3eef';

;(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  })
  const page = await browser.newPage({context: 'default'})
  await page.setViewport({ width: 1000, height: 500 })
  await page.goto('http://localhost:3000/novo')

  await page.waitFor('#generate-random-data-button', {
    visible: true,
    timeout: 60000
  })

  let i = 0

  while (i < 1000) {
    console.log('First: ', i)
    await page.click('#generate-random-data-button')
    await page.click('#submit-medical-record-button')
    await page.waitFor(2500)

    i++
  }
})()
