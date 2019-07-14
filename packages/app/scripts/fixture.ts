const puppeteer = require('puppeteer')

const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/e852799f-4aff-4995-a4a9-2cd6c593c50a'
;(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
  })
  const page = await browser.newPage({ context: 'default' })
  await page.setViewport({ width: 1000, height: 500 })
  await page.goto('http://localhost:3000/novo')

  await page.waitFor('#generate-random-data-button', {
    visible: true,
    timeout: 60000,
  })

  let i = 0

  while (i < 2000) {
    console.log('Number: ', i)
    await page.click('#generate-random-data-button')
    await page.click('#submit-medical-record-button')
    await page.waitForFunction(
      selector => document.querySelector(selector) !== null,
      {},
      '#submit-medical-record-button:not([disabled])',
    )

    i++
  }
})()
