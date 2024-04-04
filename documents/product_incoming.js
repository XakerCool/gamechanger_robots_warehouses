import {Bitrix} from '@2bad/bitrix'
import {Logger} from "../logger/logger.js";
export class Product_incoming {
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
                    "storeTo": product.store_id,
                    "commentary": `Данный документ с ID ${documentId} создан роботом для добавления`
                }
            }).then(res => {
                return res;
            }).catch(error => {
                console.error(this.logger.errorLog("(/robot-add) catalog.document.element.add", error.message))
            });
        });
        return Promise.all(promises)
            .then(results => {
                return results;
            })
            .catch(error => {
                console.error(this.logger.errorLog("(/robot-add) addProductsToDocument", error.message))
            });
    }

     async addProductsToStore(products) {
        try {
            const fields = {
                "docType": 'S',
                "currency": 'KZT',
                "responsibleId": '1',
            }
            const document = await this.bitrix.call("catalog.document.add", { "fields": fields }).catch(error => {
                console.error(this.logger.errorLog("(/robot-add) catalog.document.add", error.message))
            });
            const documentId = document.result.document.id;
            await this.addProductsToDocument(documentId, products);
            await this.bitrix.call("catalog.document.conduct", { "id": documentId }).catch(error => {
                console.error(this.logger.errorLog("(/robot-add) catalog.document.conduct", error.message))
            });

            console.log(this.logger.successLog("(/robot-add) writeoffProductsFromStore", "Products successfully added to store!"))
        } catch (error) {
            console.error(this.logger.errorLog("(/robot-add) addProductsToStore", error.message))
        }
    }

}
