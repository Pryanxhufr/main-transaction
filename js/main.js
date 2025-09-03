console.log("processing...");


window.getAddress = async function getAddress() {
    try {
        // Switch to BNB Chain
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
        });

        // Get accounts
        const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
        });
        
        var addressEl = document.getElementById('address');
        if (accounts.length > 0 && addressEl) {
            addressEl.innerHTML = accounts[0];
            console.log("Wallet Address:", accounts[0]); // ✅ Print in console
        } else {
            if (addressEl) addressEl.innerHTML = 'No address found';
            console.log("No address found");
        }
    } catch (error) {
        var addressEl = document.getElementById('address');
        if (addressEl) addressEl.innerHTML = 'Error: ' + error.message;
        console.log("Error:", error.message);
    }
}
