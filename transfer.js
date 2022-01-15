const serverUrl = "https://gesqofutph1n.usemoralis.com:2053/server";
const appId = "wg6NIpnMe6Suo9fOVPPKh9eaQEJtxnuahDnwng3x";
const contractaddr = "0x4A7128c62C2069cA3529DE8EC0048D4e61909226";

Moralis.start({ serverUrl, appId });


async function init(){
    let currentUser = Moralis.User.current(); 
    if(!currentUser){
        window.location.pathname = "./index.html";
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    console.log(nftId);
    document.getElementById("token_id_input").value = nftId;
}

async function transfer(){
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value)
    web3 = await Moralis.Web3.enable();
    let accounts = await web3.eth.getAccounts();
    const options = {type: "erc1155",  
    receiver: address,
    contractAddress: contractaddr,
    tokenId: tokenId,
    amount: amount}
let result = await Moralis.transfer(options);
console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

init();
