async function encryptText() {
    const text = document.getElementById('inputText').value;
    if (!text) {
        alert("Please enter some text to encrypt");
        return;
    }

    const response = await fetch('/encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    const result = await response.json();
    document.getElementById('outputText').textContent = result.encryptedText;
}

async function decryptText() {
    const text = document.getElementById('outputText').textContent;
    if (!text) {
        alert("Please encrypt some text first");
        return;
    }

    const response = await fetch('/decrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    const result = await response.json();
    if (result.error) {
        alert(result.error);
    } else {
        document.getElementById('outputText').textContent = result.decryptedText;
    }
}
