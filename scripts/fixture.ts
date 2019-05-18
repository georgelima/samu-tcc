const puppeteer = require('puppeteer')
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1000, height: 500 })
  await page.goto('https://samu-george-tcc.georgelima.now.sh/novo')
  await page.waitForSelector('#generate-random-data-button', {
    visible: true,
  })

  let i = 0

  while (i < 1000) {
    await page.click('#generate-random-data-button')
    await page.click('#submit-medical-record-button')
    await page.waitFor(2500)

    i++
  }

  browser.close()
})()
