//test 7
const serverUrl = "https://gesqofutph1n.usemoralis.com:2053/server";
const appId = "wg6NIpnMe6Suo9fOVPPKh9eaQEJtxnuahDnwng3x";
const contractaddr = "0x4A7128c62C2069cA3529DE8EC0048D4e61909226";
let currentUser ;

Moralis.start({ serverUrl, appId });

function fetchNFTMetadata(NFTs){
    let promises = [];
    for (let i = 0; i < NFTs.length ; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        promises.push(fetch(serverUrl + "/functions/getNFT?_ApplicationId=" + appId + "&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = {address: contractaddr, token_id: id , chain: "Mumbai"};
            return Moralis.Web3API.token.getTokenIdOwners (options)
        })
     //   .then( () => {return nft;}))
     //.then( (res) => {console.log(res)}))
     .then( (res) => {
         nft.owners = [];
         res.result.forEach(element => {
            nft.owners.push(element.owner_of);

         });
         return nft;
     }))
    }
    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData){
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        let htmlString= `
        <div class= "card">
        <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${nft.metadata.name}</h5>
            <p class="card-text">${nft.metadata.description}</p>
            <p class="card-text">Amount You Own : ${ownerData[nft.token_id]}</p>
            <p class="card-text">Number of Owners : ${nft.owners.length}</p>
            <p class="card-text">Total Amount : ${nft.amount}</p>
            <a href="./mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
            <a href="./transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
        </div>

        </div> 
        `
        let col = document.createElement("div");
        col.className = "col col-md-4"
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}   

async function getOwnerData(){
    let accounts = currentUser.get("accounts"); 
    const options = { chain: 'Mumbai', address: accounts[0], token_address: contractaddr };
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => { 
        let result = data.result.reduce( (object, currentElement) => { 
            object[currentElement.token_id] = currentElement.amount;
            return object;
            }, {})
        console.log(result);
        return result;
    })

}


async function initializeApp(){
    currentUser = Moralis.User.current(); 
    if(!currentUser){
        currentUser = await Moralis.Web3.authenticate();
    }
    const options = {address: contractaddr , chain : "Mumbai" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    console.log(NFTWithMetadata);
    let ownerData = await getOwnerData();
    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();