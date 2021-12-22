import { ethers } from "ethers"
import * as NFT from '../contracts/NFT.json'
import * as NFTMarket from '../contracts/NFTMarket.json'
export class Commands{
    static async indexer(){
            const provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_HTTP_URL)
            let marketContract = new ethers.Contract(process.env.RINKEBY_NFTMARKET_ADDRESS, NFTMarket.abi, provider)
            let tokenContract = new ethers.Contract(process.env.RINKEBY_NFT_ADDRESS, NFT.abi, provider)
            console.log("start")
            let query = await marketContract.queryFilter(marketContract.filters.MarketItemCreated(), parseInt(process.env.START_BLOCK), 'latest')
            
        
            let createdEvents = await Promise.all(query.map(async i => {
                const tokenUri = await tokenContract.tokenURI(i.args['tokenId'])
                let price = ethers.utils.formatUnits(i.args['price'].toString(), 'ether')
                let event = {
                    itemId: i.args['itemId'].toNumber(),
                    tokenId: i.args['tokenId'].toNumber(),
                    price: price,
                    seller: i.args['seller'],
                    owner: i.args['owner'],
                    tokenUri,
                    sold: i.args['sold']
                }
                return event
            }))
            console.log(createdEvents)
            console.log("============")
            /* todo: insert into DB */
        
        
            let eventFilter = marketContract.filters.MarketItemSoled()
            query = await marketContract.queryFilter(eventFilter, parseInt(process.env.START_BLOCK), 'latest')
        
            let soldEvents = await Promise.all(query.map(async i => {
                const tokenUri = await tokenContract.tokenURI(i.args['tokenId'])
                let price = ethers.utils.formatUnits(i.args['price'].toString(), 'ether')
                let event = {
                    itemId: i.args['itemId'].toNumber(),
                    tokenId: i.args['tokenId'].toNumber(),
                    price: price,
                    seller: i.args['seller'],
                    buyer: i.args['buyer'],
                    tokenUri,
                    sold: i.args['sold']
                }
                return event
            }))
            console.log(soldEvents)
            console.log("finish")
             /* todo: insert into DB */
    }

}