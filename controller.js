import {Bitrix} from '@2bad/bitrix'
import {Logger} from "./logger/logger.js";
export class DealOperator {
    bitrix
    logger
    constructor(url) {
        this.bitrix = Bitrix(url)
        this.logger = new Logger()
    }
    async getDeal (dealId) {
        return new Promise(async (resolve, reject) => {
            try {
                const deal = {}
                await this.bitrix.deals.get(dealId).then(async res => {
                    deal.id = res.result["ID"]
                    deal.title = res.result["TITLE"]
                    deal.stage_semantic_id = res.result["STAGE_SEMANTIC_ID"]
                    deal.stage_id = res.result["STAGE_ID"]
                    deal.type_id = res.result["TYPE_ID"]
                    deal.products = await this.getDealProducts(dealId)
                }).catch(error => {
                    console.error(this.logger.errorLog("(DealOperator) getDeal this.bitrix.deals.get", error.message))
                    resolve(null)
                })
                resolve(deal)
            } catch (error) {
                console.error(this.logger.errorLog("(DealOperator) getDeal", error.message))
            }
        })
    }

    async getDealProducts(dealId) {
        return new Promise(async (resolve, reject) => {
            try {
                let products = []
                await this.bitrix.call("crm.deal.productrows.get", { id: dealId }).then(res => {
                    Array.from(res.result).forEach(product => {
                        products.push(
                            {
                                id: product["PRODUCT_ID"],
                                name: product["PRODUCT_NAME"],
                                original_name: product["ORIGINAL_PRODUCT_NAME"],
                                quantity: product["QUANTITY"],
                                store_id: product["STORE_ID"]
                            }
                        )
                    })
                }).catch(error => {
                    console.error(this.logger.errorLog("(DealOperator) getDealProducts crm.deal.productrows.get", error.message))
                    resolve(null)
                })
                if (products.find(product => !product.store_id)) {
                    console.error(this.logger.errorLog("(DealOperator) getDealProducts", "store is null"))
                    resolve(null)
                }
                resolve(products)
            } catch (error) {
                console.error(this.logger.errorLog("(DealOperator) getDealProducts", error.message))
            }
        })
    }
}

// export async function getStores() {
//     return new Promise(async(resolve, reject) => {
//         await bitrix.call("catalog.store.list", {
//                 "select": ["id", "title"]
//             }
//         ).then(res => {
//             resolve(Array.from(res.result["stores"]))
//         }).catch(error => {
//             reject(error.message)
//         })
//     })
// }