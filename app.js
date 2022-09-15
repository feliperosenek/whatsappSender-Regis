const puppeteer = require("puppeteer");
var fs = require('fs')
const csv = require('csv-parser')
var contatos = []

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

    console.log("Aguardando 30 segundos para escanear QR CODE")

    await delay(30000)   
        
    var mensagem = fs.readFileSync('mensagem.txt', 'utf8');  
    mensagem = encodeURIComponent(mensagem)
    const results = [];
    var log = []
   
    console.log("Carregando contatos")
    fs.createReadStream('contatos.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async() => {
        results.forEach(element => {   
          contatos.push(element.contatos)
        });
        await page.close()   

        for (let i = 0; i < contatos.length; i++) {
          console.log("Enviando mensagem para: "+contatos[i])          
           page2 = await browser.newPage();
           await page2.goto("https://web.whatsapp.com/send?phone=+55"+contatos[i]+"&text="+mensagem, { waitUntil: "networkidle0" })                 
           await delay(8000)
           var verifyNumber = await page2.$("._2Nr6U")

           if(verifyNumber == null){
           await page2.click("button[aria-label='Enviar']") 
          }
           await delay(3000)
           await page2.close()
      }
    });  
 
       
  } catch (error) {
    console.log(error);
  }
}
