const Meme = artifacts.require("Meme");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Meme', ([deployer, seller, buyer]) => {
    let meme

    before(async() => {
        meme = await Meme.deployed()
    })

    describe('deployment',async() =>{
        it('deploys successfully', async() => {
        //meme = await Meme.deployed() we add before so we dont need to use this command everytime in every describe
        const address = meme.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
        })

        it('has a name', async()=>{
            const name = await meme.name()
            assert.equal(name, 'Dapp Marketplace')
            
        })
    })

    // describe('storage', async()=>{
    //     it('updates the memeHash', async()=>{
    //        //meme = await Meme.deployed()
    //        let memeHash
    //        memeHash = 'abc123'
    //        await meme.set(memeHash)
    //        const result = await meme.get()
    //        assert.equal(result, memeHash)
    //     })
    // })

    describe('products', async()=> {
        let productCount, result

        before(async()=>{
            result = await meme.createProduct('iPhone X', web3.utils.toWei('1','Ether'), '_memehash', {from: seller})
            productCount = await meme.productCount()
        })
        //c8 product
        it('creates product', async()=>{
            //success
            assert.equal(productCount,1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name ,'iPhone X' , 'name is correct')
            assert.equal(event.price,'1000000000000000000' , 'price is correct')
            assert.equal(event.owner, seller, 'owner address is correct')
            assert.equal(event.purchased, false, 'purchased is correct')

            //Failure 
            //Product muust have a name
            await await meme.createProduct('', web3.utils.toWei('1','Ether'),{from :seller}).should.be.rejected;
            //Product must have a price
            await await meme.createProduct('iPhone X', 0,{from :seller}).should.be.rejected;

        })

        //list product
        it('lists products', async()=> {
            const product = await meme.products(productCount)
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(product.name ,'iPhone X' , 'name is correct')
            assert.equal(product.price,'1000000000000000000' , 'price is correct')
            assert.equal(product.owner, seller, 'owner address is correct')
            assert.equal(product.purchased, false, 'purchased is correct')
            
        })


        //sells product
        it('sells products', async()=> {
            //track seller balance before purchase
            let oldSellerBalance 
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance) //use new whenever we use BN or create a BN .We cannot understand BN on seeing it.

            //success buyer makes purchase
            result = await meme.purchaseProduct(productCount, {from : buyer ,value: web3.utils.toWei('1','Ether')})
            //check logs
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name ,'iPhone X' , 'name is correct')
            assert.equal(event.price,'1000000000000000000' , 'price is correct')
            assert.equal(event.owner, buyer, 'owner address is correct')
            assert.equal(event.purchased, true, 'purchased is correct')
            
            //check seller receives fund
            let newSellerBalance 
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            const expectedBalance = oldSellerBalance.add(price) //add is a function we can use for BN

            assert.equal(newSellerBalance.toString(), expectedBalance.toString())

            //Failure 
            //try to buy a product that doenst not exist
            await meme.purchaseProduct(99, {from : buyer ,value: web3.utils.toWei('1','Ether')}).should.be.rejected
            
            //using insufficient ether
            await meme.purchaseProduct(productCount, {from : buyer ,value: web3.utils.toWei('0.5','Ether')}).should.be.rejected

            //deployer tries to buy the product i.e product cant be purchased twice
            await meme.purchaseProduct(productCount, {from : deployer ,value: web3.utils.toWei('1','Ether')}).should.be.rejected

            //buyer tries to buy the product twice
            await meme.purchaseProduct(productCount, {from : buyer ,value: web3.utils.toWei('1','Ether')}).should.be.rejected

        })

    })
        
})