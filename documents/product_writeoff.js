import {Bitrix} from '@2bad/bitrix'
import {Logger} from "../logger/logger.js";

export class Product_writeoff {
    bitrix
    logger
    constructor(url) {
        this.bitrix = Bitrix(url)
        this.logger = new Logger()
    }
    async addProductsToDocument(documentId, products) {
        const promises = products.map(product => {
            return this.bitrix.call("catalog.document.element.add", {
                "fields": {
                    "docId": documentId,
                    "amount": product.quantity,
                    "elementId": product.id,
                    "storeFrom": product.store_id,
                    "commentary": `Данный документ с ID ${documentId} создан роботом для списания`
                }
            }).then(res => {
                return res;
            }).catch(error => {
                console.error(this.logger.errorLog("(/robot-write-off) catalog.document.element.add", error.message))
            });
        });
        return Promise.all(promises)
            .then(results => {
                return results;
            })
            .catch(error => {
                console.error(this.logger.errorLog("(/robot-write-off) addProductsToDocument", error.message))
            });
    }

    async writeoffProductsFromStore(products) {
        try {
            if (!products) {
                console.error(this.logger.errorLog("(/robot-write-off) writeoffProductsFromStore", "products is null"))
                return
            }
            let isError = false
            const fields = {
                "docType": 'D',
                "currency": 'KZT',
                "responsibleId": '1',
            }
            const document = await this.bitrix.call("catalog.document.add", { "fields": fields }).catch(error => {
                console.error(this.logger.errorLog("(/robot-write-off) catalog.document.add", error.message))
            });
            const documentId = document.result.document.id;
            await this.addProductsToDocument(documentId, products);
            await this.bitrix.call("catalog.document.conduct", { "id": documentId }).catch(error => {
                console.error(this.logger.errorLog("(/robot-write-off) catalog.document.conduct", error.message))
                isError = true
            });
            if (!isError) {
                console.log(this.logger.successLog("(/robot-write-off) writeoffProductsFromStore", "Products successfully wrote off from store!"))
            }
        } catch (error) {
            console.error(this.logger.errorLog("(/robot-write-off) writeoffProductsFromStore", error.message))
        }
    }
}

