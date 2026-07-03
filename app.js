'use strict';

const allScreens = document.querySelectorAll('.view-screen');

// Side bar buttons
const btnHome = document.getElementById('btn-home');
const btnDeposit = document.getElementById('btn-deposit');
const btnWithdrawal = document.getElementById('btn-withdrawal');
const btnHistory = document.getElementById('btn-history');

function switchScreen(targetScreenId) {
    allScreens.forEach(screen => {
        screen.classList.add('hidden');
    });

    const activeScreen = document.getElementById(targetScreenId);
    if (activeScreen) {
        activeScreen.classList.remove('hidden');
        localStorage.setItem('activeATMScreen', targetScreenId);
    }
}

const savedScreen = localStorage.getItem('activeATMScreen');

if (savedScreen) {
    switchScreen(savedScreen);
} else {
    switchScreen('screen-home');
}

btnHome.addEventListener('click', () => switchScreen('screen-home'));
btnDeposit.addEventListener('click', () => switchScreen('screen-deposit'));
btnWithdrawal.addEventListener('click', () => switchScreen('screen-withdrawal'));
btnHistory.addEventListener('click', () => switchScreen('screen-history'));

// Home screen buttons
const dashboardDepositBtn = document.getElementById('dashboard-deposit-btn');
const dashboardWithdrawBtn = document.getElementById('dashboard-withdraw-btn');
const dashboardHistoryBtn = document.getElementById('dashboard-history-btn');

dashboardDepositBtn.addEventListener('click', () => switchScreen('screen-deposit'));
dashboardWithdrawBtn.addEventListener('click', () => switchScreen('screen-withdrawal'));
dashboardHistoryBtn.addEventListener('click', () => switchScreen('screen-history'));

// === Account balance (home screen) ===

const balanceValueEl = document.getElementById('balance-value');
let accountBalance = parseFloat(balanceValueEl.textContent.replace(/,/g, ''));

function renderBalance() {
    balanceValueEl.textContent = accountBalance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// === Custom alert modal (replaces window.alert) ===
const modalOverlay = document.getElementById('app-modal-overlay');
const modalIconWrapper = document.getElementById('app-modal-icon-wrapper');
const modalTitle = document.getElementById('app-modal-title');
const modalMessage = document.getElementById('app-modal-message');
const modalCloseBtn = document.getElementById('app-modal-close');

// type is 'success' or 'error' — controls the color and icon used
function showModal(type, title, message) {
    const isSuccess = type === 'success';

    
    modalIconWrapper.style.backgroundColor = isSuccess ? '#1a3f2e' : '#3f1a1a';
    modalIconWrapper.innerHTML = `<i data-lucide="${isSuccess ? 'check-circle-2' : 'x-circle'}" class="w-7 h-7" style="color:${isSuccess ? '#7ddc9e' : '#ffb4ab'}"></i>`;

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOverlay.style.display = 'flex';

    if (window.lucide) lucide.createIcons();
}

function hideModal() {
    modalOverlay.style.display = 'none';
}

modalCloseBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) hideModal(); // clicking the dark backdrop also closes it
});

// ==== Deposit Flow ====
// Steps: 1 = Amount, 2 = Verify, 3 = PIN, 4 = Processing/Confirm
const PIN_LENGTH = 4;
const MAX_AMOUNT_DIGITS = 6; 
const CORRECT_PIN = "1234";

let currentStep = 1;
let depositAmountString = ""; 
let pinString = "";

const numButtons = document.querySelectorAll('.keypad-num');
const clearBtn = document.getElementById('btn-clear');
const backspaceBtn = document.getElementById('btn-backspace');
const confirmBtn = document.getElementById('btn-deposit-action');
const cancelBtn = document.getElementById('btn-deposit-cancel');
const depositTitle = document.getElementById('deposit-title');
const instructionsText = document.getElementById('deposit-instructions');
const displayContainer = document.getElementById('deposit-display-container');
const depositScreen = document.getElementById('screen-deposit');

const stepAmountDot = document.getElementById('step-amount-dot');
const stepAmountGroup = document.getElementById('step-amount-group');
const stepVerifyDot = document.getElementById('step-verify-dot');
const stepVerifyGroup = document.getElementById('step-verify-group');
const stepPinDot = document.getElementById('step-pin-dot');
const stepPinGroup = document.getElementById('step-pin-group');
const stepConfirmDot = document.getElementById('step-confirm-dot');
const stepConfirmGroup = document.getElementById('step-confirm-group');
const line1 = document.getElementById('line-1');
const line2 = document.getElementById('line-2');
const line3 = document.getElementById('line-3');

// ---- Digit / backspace / clear handling ----
// Steps 1 and 3 are the only two steps that accept input (amount, then PIN).
// Verify (2) and Processing (4) are read-only, so digits are ignored there.

function handleDigit(digit) {
    if (currentStep === 1) {
        if (depositAmountString.length >= MAX_AMOUNT_DIGITS) return;
        if (depositAmountString === "" && digit === "0") return; // no leading zero
        depositAmountString += digit;
        renderAmountDisplay();
    } else if (currentStep === 3) {
        if (pinString.length >= PIN_LENGTH) return;
        pinString += digit;
        renderPinDisplay();
    }
}

function handleBackspace() {
    if (currentStep === 1) {
        depositAmountString = depositAmountString.slice(0, -1);
        renderAmountDisplay();
    } else if (currentStep === 3) {
        pinString = pinString.slice(0, -1);
        renderPinDisplay();
    }
}

function handleClear() {
    if (currentStep === 1) {
        depositAmountString = "";
        renderAmountDisplay();
    } else if (currentStep === 3) {
        pinString = "";
        renderPinDisplay();
    }
}

numButtons.forEach(button => {
    button.addEventListener('click', () => handleDigit(button.textContent.trim()));
});
backspaceBtn.addEventListener('click', handleBackspace);
clearBtn.addEventListener('click', handleClear);

// Physical keyboard support 
document.addEventListener('keydown', (e) => {
    if (depositScreen.classList.contains('hidden')) return;

    if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
    } else if (e.key === 'Enter') {
        confirmBtn.click();
    } else if (e.key === 'Escape') {
        cancelBtn.click();
    }
});

// --- Rendering the display box (changes shape per step) ---

function renderAmountDisplay() {
    const amount = depositAmountString === "" ? "0" : parseInt(depositAmountString, 10);
    displayContainer.innerHTML = `
        <span class="flex items-end gap-1">
            <p class="text-lg">$</p>
            <p class="text-5xl font-bold tracking-wider">${amount}.00</p>
        </span>
    `;
}

function renderVerifyDisplay() {
    const amount = depositAmountString === "" ? "0" : parseInt(depositAmountString, 10);
    displayContainer.innerHTML = `
        <p class="text-[11px] uppercase tracking-widest text-[#8e9098] mb-1">You are about to deposit</p>
        <span class="flex items-end gap-1">
            <p class="text-lg">$</p>
            <p class="text-5xl font-bold tracking-wider">${amount}.00</p>
        </span>
    `;
}

function renderPinDisplay() {
    let dots = "";
    for (let i = 0; i < PIN_LENGTH; i++) {
        const filled = i < pinString.length;
        dots += `<span class="inline-block w-4 h-4 rounded-full mx-2 ${filled ? 'bg-[#b2c7ef]' : 'bg-[#343537] border border-[#44474e]'}"></span>`;
    }
    displayContainer.innerHTML = `<div class="flex items-center justify-center py-5">${dots}</div>`;
}

// ---- Stepper visuals ----
function setStepDotState(dotEl, groupEl, active) {
    dotEl.className = "transition-all duration-300 rounded-full flex items-center justify-center";
    if (active) {
        dotEl.classList.add('w-5', 'h-5');
        dotEl.style.backgroundColor = '#1a3150';
        dotEl.style.border = '1px solid #b2c7ef4d';
        dotEl.style.boxShadow = '0 0 12px rgba(178,199,239,0.2)';
        dotEl.innerHTML = `<div class="w-3 h-3 rounded-full" style="background-color:#b2c7ef"></div>`;
        groupEl.querySelector('span').style.color = '#b2c7ef';
    } else {
        dotEl.classList.add('w-3.5', 'h-3.5');
        dotEl.style.backgroundColor = '#343537';
        dotEl.style.border = '1px solid transparent';
        dotEl.style.boxShadow = 'none';
        dotEl.innerHTML = "";
        groupEl.querySelector('span').style.color = '#8e9098';
    }
}

// ---- Main render: draws whichever step is active ----

function renderStepFlow() {
    setStepDotState(stepAmountDot, stepAmountGroup, currentStep === 1);
    setStepDotState(stepVerifyDot, stepVerifyGroup, currentStep === 2);
    setStepDotState(stepPinDot, stepPinGroup, currentStep === 3);
    setStepDotState(stepConfirmDot, stepConfirmGroup, currentStep === 4);

    confirmBtn.disabled = false;
    confirmBtn.classList.remove('opacity-60', 'cursor-not-allowed');

    if (currentStep === 1) {
        depositTitle.textContent = "Enter deposit amount";
        instructionsText.textContent = "Use the keypad or your keyboard to type the amount, then press Enter or Next.";
        confirmBtn.innerHTML = `<span>Next: Verify</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        renderAmountDisplay();
    } else if (currentStep === 2) {
        depositTitle.textContent = "Verify your deposit";
        instructionsText.textContent = "Double check the amount below before continuing.";
        confirmBtn.innerHTML = `<span>Continue</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        renderVerifyDisplay();
    } else if (currentStep === 3) {
        depositTitle.textContent = "Enter your PIN";
        instructionsText.textContent = "Enter your 4-digit PIN to authorize this deposit.";
        confirmBtn.innerHTML = `<span>Confirm Deposit</span> <i data-lucide="circle-check" class="w-4 h-4"></i>`;
        renderPinDisplay();
    } else if (currentStep === 4) {
        depositTitle.textContent = "Processing";
        instructionsText.textContent = "Transaction executing securely. Do not close this terminal.";
        confirmBtn.innerHTML = `<span>Processing...</span> <i data-lucide="loader" class="w-4 h-4 animate-spin"></i>`;
        confirmBtn.disabled = true;
        confirmBtn.classList.add('opacity-60', 'cursor-not-allowed');

        const amount = parseInt(depositAmountString, 10);
        setTimeout(() => {
            accountBalance += amount;
            renderBalance();
            resetDepositFlow();
            switchScreen('screen-home');
            showModal('success', 'Deposit Successful', `$${amount}.00 has been added to your account. Your new balance is $${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
        }, 2500);
    }

    if (window.lucide) lucide.createIcons();
}

function resetDepositFlow() {
    depositAmountString = "";
    pinString = "";
    currentStep = 1;
    renderStepFlow();
}

// ---- Confirm button: advances the state machine ----

confirmBtn.addEventListener('click', () => {
    if (currentStep === 1) {
        if (depositAmountString === "" || parseInt(depositAmountString, 10) === 0) {
            showModal('error', 'Invalid Amount', 'Please enter an amount greater than $0 first.');
            return;
        }
        currentStep = 2;
    } else if (currentStep === 2) {
        currentStep = 3;
    } else if (currentStep === 3) {
        if (pinString.length !== PIN_LENGTH) {
            showModal('error', 'Incomplete PIN', 'Please enter your full 4-digit PIN.');
            return;
        }
        if (pinString !== CORRECT_PIN) {
            showModal('error', 'Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
            pinString = ""; // clear it so they aren't stuck editing a wrong PIN
            renderPinDisplay();
            return;
        }
        currentStep = 4;
    }
    renderStepFlow();
});

// ---- Cancel button: wipes state and goes home ----

cancelBtn.addEventListener('click', () => {
    resetDepositFlow();
    switchScreen('screen-home');
});

// Draw the initial state whenever the deposit screen first loads
renderStepFlow();