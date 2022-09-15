const puppeteer = require("puppeteer");
const api = require('express');
const bodyParser = require('body-parser');
const express = api();
express.use(api.json())


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

app();
async function app() {
  try {
    let options = {
      defaultViewport: {
        width: 1800,
        height: 600,
      },
      headless: false,
    };

    console.log("Abrindo o Whatsapp")

    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();

    await page.goto("https://web.whatsapp.com/")


    express.post('/', async (req,res) => {    
    
      console.log(req.body['mautic.form_on_submit'][0].submission.results);
      var tel = req.body['mautic.form_on_submit'][0].submission.results.whatsapp;
      var nome = req.body['mautic.form_on_submit'][0].submission.results.nome

      page2 = await browser.newPage();
      var url = "https://web.whatsapp.com/send?phone=+55"+tel+"&text=Salve "+nome+"!!!! Primeira mensagem automatizada do Mautic no bot de Whatsapp da SouCannabis"
   	await page2.goto(url)
      await delay(8000)
  
      var verifyNumber = await page2.$("._2Nr6U")
      if (verifyNumber == null) {
        await page2.click("button[aria-label='Enviar']")
      }
  
      await delay(3000)
      await page2.close()
    })

  

  } catch (error) {
    console.log(error);
  }
}

express.listen(3000, () => {
  console.log("Express ON");
})
