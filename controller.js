import {Bitrix} from '@2bad/bitrix'
export class DealOperator {
    bitrix
    constructor(url) {
        this.bitrix = Bitrix(url)
    }
    async getDeal (dealId) {
        return new Promise(async (resolve, reject) => {
            const deal = {}
            await this.bitrix.deals.get(dealId).then(async res => {
                deal.id = res.result["ID"]
                deal.title = res.result["TITLE"]
                deal.stage_semantic_id = res.result["STAGE_SEMANTIC_ID"]
                deal.stage_id = res.result["STAGE_ID"]
                deal.type_id = res.result["TYPE_ID"]
                deal.products = await this.getDealProducts(dealId)
            }).catch(error => resolve(error.message))
            resolve(deal)
        })
    }

    async getDealProducts(dealId) {
        return new Promise(async (resolve, reject) => {
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
                reject(error.message)
            })
            resolve(products)
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