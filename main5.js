//test 2
const serverUrl = "https://gesqofutph1n.usemoralis.com:2053/server";
const appId = "wg6NIpnMe6Suo9fOVPPKh9eaQEJtxnuahDnwng3x";
const contractaddr = "0x4A7128c62C2069cA3529DE8EC0048D4e61909226";

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
        .then( () => {return nft;}))
    }
    return Promise.all(promises);
}


function renderInventory(NFTs){
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        let htmlString= `
        <div class= "card" style="width: 18rem;" >
            <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nft.metadata.name}</h5>
                <p class="card-text">${nft.metadata.description}</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>

            </div> `
    }
}   


async function initializeApp(){
    let currentUser = Moralis.User.current(); 
    if(!currentUser){
        currentUser = await Moralis.Web3.authenticate();
    }
    const options = {address: contractaddr , chain : "Mumbai" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    console.log(NFTs);
}

initializeApp();