// file to handle MFA setup and verification

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Simulate a basic authentication check (for simulation/learning purposes only)
        if (username === 'sara' && password === '1234') {
            alert('Login successful!');
            // Redirect to another page or perform other actions
        } else {
            alert('Invalid username or password');
        }
    });
});




document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const mfaSetupSection = document.querySelector('.mfa-setup');
    const mfaVerificationSection = document.querySelector('.mfa-verification');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Perform your registration logic here

        // Show the MFA setup section after successful registration
        mfaSetupSection.style.display = 'block';
        setupMFA();
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Perform your login logic here
        const isLoginSuccessful = true;  // Replace this with your actual login logic

        if (isLoginSuccessful) {
            // Show the MFA verification section after successful login
            mfaVerificationSection.style.display = 'block';
            // Hide the login form
            loginForm.style.display = 'none';
        }
    });

    // MFA verification form submission
    const mfaVerificationForm = document.getElementById('mfaVerificationForm');
    mfaVerificationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Perform MFA verification logic here

        // For the purpose of this example, assume the MFA verification is successful
        const isMFAVerified = true;

        if (isMFAVerified) {
            alert('Multi-Factor Authentication successful! You are now logged in.');
        } else {
            alert('Invalid MFA code. Please try again.');
        }
    });
});

function setupMFA() {
    // Generate a secret for MFA
    const secret = speakeasy.generateSecret({ length: 20 });

    // Display the secret key to the user
    document.getElementById('mfa-secret').value = secret.base32;
}

function enableMFA() {
    const verificationCode = document.getElementById('mfa-verification-code').value;

    // Validate the verification code
    const isValid = speakeasy.totp.verify({
        secret: document.getElementById('mfa-secret').value,
        encoding: 'base32',
        token: verificationCode,
    });

    if (isValid) {
        alert('Multi-Factor Authentication enabled successfully!');
    } else {
        alert('Invalid verification code. Please try again.');
    }
}
