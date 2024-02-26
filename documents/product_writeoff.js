import {Bitrix} from '@2bad/bitrix'

export class Product_writeoff {
    bitrix
    constructor(url) {
        this.bitrix = Bitrix(url)
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
                throw new Error(error.message);
            });
        });
        return Promise.all(promises)
            .then(results => {
                return results;
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    }

    async writeoffProductsFromStore(products) {
        try {
            const fields = {
                "docType": 'D',
                "currency": 'KZT',
                "responsibleId": '1',
            }
            const document = await this.bitrix.call("catalog.document.add", { "fields": fields });
            const documentId = document.result.document.id;
            await this.addProductsToDocument(documentId, products);
            await this.bitrix.call("catalog.document.confirm", { "id": documentId });

            return "Products successfully wrote off from store!";
        } catch (error) {
            throw new Error("Failed to write off products: " + error.message);
        }
    }
}

