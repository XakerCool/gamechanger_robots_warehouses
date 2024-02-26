import express from 'express';
import bodyParser from 'body-parser';
import {DealOperator} from './controller.js'
import {Product_writeoff} from "./documents/product_writeoff.js";
import {Product_incoming} from "./documents/product_incoming.js";

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/robot-write-off", async (req, res) => {
    const productWriteoff = new Product_writeoff(req.query.link)
    const dealOperator = new DealOperator(req.query.link)
    const dealId = Array.from(req.body["document_id"]).find(item => item.includes("DEAL") ? item : null).split("_")[1]
    const deal = await dealOperator.getDeal(dealId)
    console.log(await productWriteoff.writeoffProductsFromStore(deal.products))
})


app.post('/robot-add', async (req, res) => {
    // const bitrix = Bitrix(req.query.link)
    const productIncoming = new Product_incoming(req.query.link)
    const dealOperator = new DealOperator(req.query.link)
    const dealId = Array.from(req.body["document_id"]).find(item => item.includes("DEAL") ? item : null).split("_")[1]
    const deal = await dealOperator.getDeal(dealId)
    console.log(await productIncoming.addProductsToStore(deal.products))
});

app.listen(port, async () => {
    console.log(`Сервер запущен на порту ${port}`);
});
