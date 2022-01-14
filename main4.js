//test 2
const serverUrl = "https://cllcdhblo2ym.usemoralis.com:2053/server";
const appId = "w6wCsm2SxAiNUkW5A4P4l1xGOhdy8jUfpMf7Nnhw";
const contractaddr = "0x63d8d3B8c7179d55Ef93286Fd8f908c5D84588E2";

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
    console.log(NFTWithMetadata);
}

initializeApp();