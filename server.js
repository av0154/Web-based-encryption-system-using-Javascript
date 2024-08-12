const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); 

const ENCRYPTION_KEY = crypto.randomBytes(32); 
const IV_LENGTH = 16; 


function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}


function decrypt(encryptedText) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


app.post('/encrypt', (req, res) => {
    const text = req.body.text;
    const encryptedText = encrypt(text);
    res.json({ encryptedText });
});


app.post('/decrypt', (req, res) => {
    const text = req.body.text;
    try {
        const decryptedText = decrypt(text);
        res.json({ decryptedText });
    } catch (err) {
        res.status(400).json({ error: 'Failed to decrypt text' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
