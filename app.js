// ── PASSWORD STRENGTH ANALYSER ──────────────────────────────────────────────

const passwordInput = document.getElementById('password-input');
const strengthBar = document.getElementById('strength-bar');
const strengthScore = document.getElementById('strength-score');
const strengthFeedback = document.getElementById('strength-feedback');

// Listen for user typing in the password box
passwordInput.addEventListener('input', function () {
    const password = passwordInput.value;
    const result = analysePassword(password);
    updateStrengthUI(result);
});

// ── SCORING ALGORITHM ────────────────────────────────────────────────────────
function analysePassword(password) {
    let score = 0;
    const feedback = [];

    // Length checks
    if (password.length === 0) {
        return { score: 0, label: '', color: '#e0e0e0', feedback: [] };
    }
    if (password.length >= 8)  { score += 20; } 
    else { feedback.push('Use at least 8 characters.'); }

    if (password.length >= 12) { score += 10; }
    if (password.length >= 16) { score += 10; }

    // Character diversity checks
    if (/[A-Z]/.test(password)) { 
        score += 15; 
    } else { 
        feedback.push('Add at least one uppercase letter (A-Z).'); 
    }

    if (/[a-z]/.test(password)) { 
        score += 15; 
    } else { 
        feedback.push('Add at least one lowercase letter (a-z).'); 
    }

    if (/[0-9]/.test(password)) { 
        score += 15; 
    } else { 
        feedback.push('Add at least one number (0-9).'); 
    }

    if (/[^A-Za-z0-9]/.test(password)) { 
        score += 15; 
    } else { 
        feedback.push('Add at least one special character (e.g. !, @, #, $).'); 
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Determine label and colour based on score
    let label, color;
    if (score < 40) {
        label = 'Weak';
        color = '#e53935'; // Red
    } else if (score < 70) {
        label = 'Moderate';
        color = '#fb8c00'; // Amber
    } else {
        label = 'Strong';
        color = '#43a047'; // Green
    }

    if (feedback.length === 0) {
        feedback.push('Great password! Well done.');
    }

    return { score, label, color, feedback };
}

// ── UPDATE THE UI ────────────────────────────────────────────────────────────
function updateStrengthUI(result) {
    // Update the strength bar
    strengthBar.style.width = result.score + '%';
    strengthBar.style.backgroundColor = result.color;

    // Update the score text
    if (result.score === 0) {
        strengthScore.textContent = '';
    } else {
        strengthScore.textContent = `Score: ${result.score}/100 — ${result.label}`;
        strengthScore.style.color = result.color;
    }

    // Update the feedback list
    if (result.feedback.length === 0) {
        strengthFeedback.textContent = '';
    } else {
        strengthFeedback.innerHTML = result.feedback
            .map(tip => `<p>• ${tip}</p>`)
            .join('');
    }
}
// ── BREACH CHECKER ───────────────────────────────────────────────────────────

const breachBtn = document.getElementById('breach-btn');
const breachResult = document.getElementById('breach-result');

breachBtn.addEventListener('click', async function () {
    const password = passwordInput.value;

    // Check password has been entered
    if (password.length === 0) {
        breachResult.textContent = 'Please enter a password first.';
        breachResult.className = '';
        return;
    }

    breachResult.textContent = 'Checking...';
    breachResult.className = '';

    try {
        const pwned = await checkBreach(password);

        if (pwned === 0) {
            breachResult.textContent = '✅ Good news! This password was not found in any known data breaches.';
            breachResult.className = 'breach-safe';
        } else {
            breachResult.textContent = `⚠️ Warning! This password has appeared in ${pwned.toLocaleString()} known data breaches. Do not use it.`;
            breachResult.className = 'breach-found';
        }
    } catch (error) {
        breachResult.textContent = 'Unable to check breaches right now. Please try again later.';
        breachResult.className = '';
    }
});

// ── K-ANONYMITY BREACH CHECK ─────────────────────────────────────────────────
async function checkBreach(password) {
    // Step 1: Hash the password using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);

    // Step 2: Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // Step 3: Split into prefix (first 5 chars) and suffix (rest)
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    // Step 4: Send only the prefix to HIBP API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();

    // Step 5: Check if our suffix appears in the returned list
    const lines = text.split('\n');
    for (const line of lines) {
        const [returnedSuffix, count] = line.split(':');
        if (returnedSuffix.trim() === suffix) {
            return parseInt(count.trim());
        }
    }

    return 0; // Not found in any breach
}
// ── DARK MODE TOGGLE ─────────────────────────────────────────────────────────

const darkModeBtn = document.getElementById('dark-mode-btn');

darkModeBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    // Change button text depending on mode
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = '☀️ Light Mode';
    } else {
        darkModeBtn.textContent = '🌙 Dark Mode';
    }
});