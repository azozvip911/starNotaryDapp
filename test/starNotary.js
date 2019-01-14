//import 'babel-polyfill';
const StarNotary = artifacts.require('starNotary')



contract('StarNotary part 1', async (accs) => {
  
  

  it('1- can Create a Star', async() => {
    let  accounts = accs;
  let instance = await StarNotary.deployed();
    let tokenId = 1;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
  });

  it('2- lets user1 put up their star for sale', async() => {
    let  accounts = accs;
  let instance = await StarNotary.deployed();
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });
});

contract('StarNotary part 2', async (accs) => {
  it('3- lets user1 get the funds after the sale', async() => {
    let  accounts = accs;
  let instance = await StarNotary.deployed();
    let user1 = accounts[2];
    let user2 = accounts[3];
    let starId = 3
    let starPrice = web3.utils.toWei('0.01', 'ether')
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1)

    let i = Number(balanceOfUser1BeforeTransaction) 
    let n = i + Number(starPrice);
    assert.equal(n, Number(balanceOfUser1AfterTransaction));
  });

  it('4- lets user2 buy a star, if it is put up for sale', async() => {
    let  accounts = accs;
  let instance = await StarNotary.deployed();
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.utils.toWei('0.01', 'ether')
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });
});

contract('StarNotary part 3', async (accs) => {

  it('5- lets user2 buy a star and decreases its balance in ether', async() => {
    let  accounts = accs;
  let instance = await StarNotary.deployed();
    let user1 = accounts[3]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.utils.toWei('.01', 'ether')
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)
    let before = Number(balanceOfUser2BeforeTransaction)
    let after = Number(balanceAfterUser2BuysStar)
    var x = before - after;
    assert.equal(x, Number(starPrice));
  });

  it("6- token name added properly", async() => {
    let instance = await StarNotary.deployed();
    assert.equal(await instance.name.call(),'Abdulaziz Token');
  });

});

contract('StarNotary part 4', async (accs) => {

  it("7- token symbol added properly", async() => {
    let instance = await StarNotary.deployed();
    assert.equal(await instance.symbol.call(), 'AZIZ');
  });
  it("8- two users can exchange thier stars", async() => {
    let instance = await StarNotary.deployed();
    let starId1 = 2;
    let starId2 = 3;
    let user1 = accs[2];
    let user2 = accs[3];
    
    await instance.createStar('star1', starId1, {from: user1});
    await instance.createStar('star2', starId2, {from: user2});
    await instance.exchangeStars(starId1, starId2, {from: user1})

    let owner = await instance.ownerOf.call(starId1)

    
    assert.equal(owner, user2);
  });

  it("9- startoken can be transfered", async() => {
    let instance = await StarNotary.deployed();
    let user1 = accs[2];
    let user2 = accs[3];
    let starId1 = 5;
    let starId2 = 6; 
    await instance.createStar('star 1', starId1, {from: user1})
    await instance.createStar('star 2', starId2, {from: user2})
    await instance.transferStar(user2, starId1, {from: user1})
    assert.equal(await instance.ownerOf.call(starId1),user2);
  });
  // test lookup token id to star infor
  it("10- lookup token id to star info", async() => {
    let instance = await StarNotary.deployed();
    let user1 = accs[2];
    let starId = 7;
    await instance.createStar('Star1', starId, {from: user1})
    let starName = await instance.lookUptokenIdToStarInfo.call(starId)
    assert.equal(starName, 'Star1')
  });

});

  // Write Tests for:

// 1) The token name and token symbol are added properly.
// 2) 2 users can exchange their stars.
// 3) Stars Tokens can be transferred from one address to another.
