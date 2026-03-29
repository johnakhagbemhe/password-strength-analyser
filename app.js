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