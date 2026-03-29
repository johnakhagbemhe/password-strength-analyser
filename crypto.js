// ── PASSWORD GENERATOR ───────────────────────────────────────────────────────

const generateBtn = document.getElementById('generate-btn');
const generatedPassword = document.getElementById('generated-password');

generateBtn.addEventListener('click', function () {
    const password = generatePassword(16);
    generatedPassword.textContent = password;
});

// ── GENERATION ALGORITHM ─────────────────────────────────────────────────────
function generatePassword(length) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers   = '0123456789';
    const symbols   = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Combine all character sets
    const allChars = uppercase + lowercase + numbers + symbols;

    // Guarantee at least one character from each set
    let password = [
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(symbols),
    ];

    // Fill the rest of the password to reach desired length
    for (let i = password.length; i < length; i++) {
        password.push(getRandomChar(allChars));
    }

    // Shuffle the password array so guaranteed chars aren't always first
    password = shuffleArray(password);

    return password.join('');
}

// ── HELPER: Get one cryptographically secure random character ─────────────────
function getRandomChar(charset) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return charset[array[0] % charset.length];
}

// ── HELPER: Shuffle array using crypto random values ─────────────────────────
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        const j = randomArray[0] % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}