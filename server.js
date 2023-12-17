const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const users = []; // Store users in memory (for demonstration purposes)

// Generate a secret and a QR code for the user
function generateSecretAndQRCode(username) {
    const secret = speakeasy.generateSecret({ length: 20, name: username });
    const otpAuthUrl = speakeasy.otpAuthURL({ secret: secret.ascii, label: username, issuer: 'YourApp' });
    return { secret, otpAuthUrl };
}

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate MFA secret and QR code
    const { secret, otpAuthUrl } = generateSecretAndQRCode(username);

    // Store the user in memory (for demonstration purposes)
    users.push({ username, password: hashedPassword, mfaSecret: secret.ascii });

    // Send the QR code to the client for MFA setup
    QRCode.toDataURL(otpAuthUrl, (err, imageUrl) => {
        if (err) {
            return res.status(500).json({ error: 'Error generating QR code' });
        }
        res.status(201).json({ message: 'User registered successfully', imageUrl });
    });
});

app.post('/login', (req, res) => {
    const { username, password, mfaCode } = req.body;

    // Find the user by username
    const user = users.find(user => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check MFA if enabled
    if (user.mfaSecret) {
        const isValidMFA = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'ascii',
            token: mfaCode,
            window: 1,
        });

        if (!isValidMFA) {
            return res.status(401).json({ error: 'Invalid MFA code' });
        }
    }

    res.status(200).json({ message: 'Login successful' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
