import {Bitrix} from '@2bad/bitrix'
export class Product_incoming {
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
                    "storeTo": product.store_id,
                    "commentary": `Данный документ с ID ${documentId} создан роботом для добавления`
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
                console.error(error.message);
                return ""
            });
    }

     async addProductsToStore(products) {
        try {
            const fields = {
                "docType": 'S',
                "currency": 'KZT',
                "responsibleId": '1',
            }
            const document = await this.bitrix.call("catalog.document.add", { "fields": fields });
            const documentId = document.result.document.id;
            await this.addProductsToDocument(documentId, products);
            await this.bitrix.call("catalog.document.conduct", { "id": documentId });

            return "Products successfully added to store!";
        } catch (error) {
            console.log("Failed to add products: " + error.message);
            return ""
        }
    }

}
