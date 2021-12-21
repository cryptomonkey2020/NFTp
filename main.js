const serverUrl = "https://utsohh6xleee.usemoralis.com:2053/server";
const appId = "jwNeZK4ZwXpP2WhLuEk9IPn129NQGGdE6zxFRSi6";
const contractaddr = "0xF844EDefB4FC5910516e771A28528B4BEf494fBB";
Moralis.start({ serverUrl, appId });

function fetchNFTMetadata(NFTs){
    let promises = [];
    for (let i = 0; i < NFTs.length ; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        promises.push(fetch("https://utsohh6xleee.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=jwNeZK4ZwXpP2WhLuEk9IPn129NQGGdE6zxFRSi6&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then( () => {return nft;}))
    }
    return Promise.all(promises);
}
async function initializeApp(){
    let currentUser = Moralis.User.current(); 
    if(!currentUser){
        currentUser = await Moralis.Web3.authenticate();
    }
    const options = {address: contractaddr , chain : "rinkeby" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    console.log(NFTWithMetadata);
}

initializeApp();


