'use strict';

const allScreens = document.querySelectorAll('.view-screen');

// Side bar buttons
const btnHome = document.getElementById('btn-home');
const btnDeposit = document.getElementById('btn-deposit');
const btnWithdrawal = document.getElementById('btn-withdrawal');
const btnHistory = document.getElementById('btn-history');
const btnLogout = document.getElementById('btn-logout');

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

btnHome.addEventListener('click', () => switchScreen('screen-home'));
btnDeposit.addEventListener('click', () => switchScreen('screen-deposit'));
btnWithdrawal.addEventListener('click', () => switchScreen('screen-withdrawal'));
btnHistory.addEventListener('click', () => switchScreen('screen-history'));

// === Mobile navigation drawer ===
// Below the md breakpoint the sidebar is an off-canvas drawer (translated fully
// off-screen). The hamburger button slides it in and dims the rest of the page
// with an overlay; from md up the sidebar is always visible and this code is inert.
const mobileMenuToggle = document.getElementById('btn-mobile-menu-toggle');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const sidebarNav = document.getElementById('sidebar-nav');

function isMobileMenuOpen() {
    return sidebarNav.classList.contains('translate-x-0');
}

function openMobileMenu() {
    sidebarNav.classList.remove('-translate-x-full');
    sidebarNav.classList.add('translate-x-0');
    mobileNavOverlay.classList.remove('hidden');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden');
    if (mobileMenuIcon) {
        mobileMenuIcon.setAttribute('data-lucide', 'x');
        if (window.lucide) lucide.createIcons();
    }
}

function closeMobileMenu() {
    sidebarNav.classList.add('-translate-x-full');
    sidebarNav.classList.remove('translate-x-0');
    mobileNavOverlay.classList.add('hidden');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');
    if (mobileMenuIcon) {
        mobileMenuIcon.setAttribute('data-lucide', 'menu');
        if (window.lucide) lucide.createIcons();
    }
}

function toggleMobileMenu() {
    if (isMobileMenuOpen()) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
mobileNavOverlay.addEventListener('click', closeMobileMenu);

// Picking any nav item closes the drawer so the next screen is visible
[btnHome, btnDeposit, btnWithdrawal, btnHistory, btnLogout].forEach(btn => {
    btn.addEventListener('click', closeMobileMenu);
});

// If the viewport is resized past the md breakpoint while the drawer is open
// (e.g. rotating a tablet, resizing a browser window), reset to the desktop state.
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isMobileMenuOpen()) {
        closeMobileMenu();
    }
});

// Escape closes the drawer, same as it cancels a deposit/withdrawal in progress
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen()) {
        closeMobileMenu();
    }
});

// Home screen buttons
const dashboardDepositBtn = document.getElementById('dashboard-deposit-btn');
const dashboardWithdrawBtn = document.getElementById('dashboard-withdraw-btn');
const dashboardHistoryBtn = document.getElementById('dashboard-history-btn');

dashboardDepositBtn.addEventListener('click', () => switchScreen('screen-deposit'));
dashboardWithdrawBtn.addEventListener('click', () => switchScreen('screen-withdrawal'));
dashboardHistoryBtn.addEventListener('click', () => switchScreen('screen-history'));

// === Account balance (persisted, drives both the home and history screens) ===

const balanceValueEl = document.getElementById('balance-value');
const historyBalanceValueEl = document.getElementById('history-balance-value');

function loadBalance() {
    const stored = localStorage.getItem('atmBalance');
    return stored !== null ? parseFloat(stored) : 12450.00;
}

function saveBalance() {
    localStorage.setItem('atmBalance', String(accountBalance));
}

let accountBalance = loadBalance();

function renderBalance() {
    const formatted = accountBalance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    balanceValueEl.textContent = formatted;
    if (historyBalanceValueEl) historyBalanceValueEl.textContent = formatted;
}

// === Transaction history (persisted, renders the History screen table) ===

const transactionTableBody = document.getElementById('transaction-table-body');

function loadTransactions() {
    try {
        const stored = localStorage.getItem('atmTransactions');
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        return [];
    }
}

function saveTransactions() {
    localStorage.setItem('atmTransactions', JSON.stringify(transactions));
}

let transactions = loadTransactions();

function formatTransactionDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

// type is 'Deposit' or 'Withdrawal'. amount is always a positive number.
function addTransaction(type, amount, resultingBalance) {
    const transaction = {
        type,
        amount,
        date: new Date().toISOString(),
        balanceAfter: resultingBalance,
        description: type === 'Deposit'
            ? 'ATM Terminal 8842 - Cash Deposit'
            : 'ATM Terminal 8842 - Cash Withdrawal'
    };
    transactions.unshift(transaction); // newest first
    saveTransactions();
    renderTransactionHistory();
}

function renderTransactionHistory() {
    if (!transactionTableBody) return;

    if (transactions.length === 0) {
        transactionTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-5 py-10 text-center text-[#8e9098] text-sm">
                    No transactions yet. Deposits and withdrawals will appear here.
                </td>
            </tr>`;
        return;
    }

    transactionTableBody.innerHTML = transactions.map((tx) => {
        const isDeposit = tx.type === 'Deposit';
        const colorClass = isDeposit ? 'text-[#10da14]' : 'text-[#f63e4a]';
        const icon = isDeposit ? 'arrow-down-left' : 'arrow-up-right';
        const sign = isDeposit ? '+' : '-';
        const balanceFormatted = tx.balanceAfter.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return `
            <tr>
                <td class="px-5 py-3 text-[#c4c6cf] whitespace-nowrap">${formatTransactionDate(tx.date)}</td>
                <td class="px-5 py-3 ${colorClass} whitespace-nowrap">
                    <span class="flex items-center gap-1"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i> ${tx.type}</span>
                </td>
                <td class="px-5 py-3 text-[#c4c6cf]">${tx.description}</td>
                <td class="px-5 py-3 text-right ${colorClass} font-medium whitespace-nowrap">
                    <div>${sign}$${tx.amount.toFixed(2)}</div>
                    <div class="text-[10px] text-[#8e9098] font-normal">Bal: $${balanceFormatted}</div>
                </td>
            </tr>`;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

// === Print / download receipt ===
// window.print() with the @media print rules in <head> is the standard vanilla-JS
// way to get a PDF out of the browser with no extra library: the browser's own
// print dialog offers "Save as PDF" as a destination on every major platform.
// If printing genuinely isn't available (e.g. some embedded webviews), we fall
// back to downloading a plain-text receipt instead, so the button always does
// something useful either way.

const btnPrintReceipt = document.getElementById('btn-print-receipt');
const printReceiptContainer = document.getElementById('print-receipt');

function getReceiptData() {
    return {
        generatedAt: new Date(),
        accountHolder: 'Alex Johnson',
        terminalId: '8842',
        balance: accountBalance,
        transactions
    };
}

function formatMoney(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderPrintReceipt() {
    if (!printReceiptContainer) return;
    const data = getReceiptData();

    const rowsHtml = data.transactions.length === 0
        ? `<tr><td colspan="4" style="padding:12px 8px;color:#666;">No transactions yet.</td></tr>`
        : data.transactions.map((tx) => {
            const isDeposit = tx.type === 'Deposit';
            const amountClass = isDeposit ? 'deposit-amount' : 'withdrawal-amount';
            const sign = isDeposit ? '+' : '-';
            return `
                <tr>
                    <td>${formatTransactionDate(tx.date)}</td>
                    <td>${tx.type}</td>
                    <td>${tx.description}</td>
                    <td class="amount-cell ${amountClass}">${sign}$${tx.amount.toFixed(2)}</td>
                </tr>`;
        }).join('');

    printReceiptContainer.innerHTML = `
        <h1>Trust Bank</h1>
        <div class="receipt-meta">
            Account Statement &middot; Terminal ${data.terminalId} &middot; ${data.accountHolder}<br>
            Generated ${data.generatedAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
        <div class="receipt-balance">Available Balance: $${formatMoney(data.balance)}</div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th class="amount-cell">Amount</th>
                </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
        </table>
        <p class="receipt-footer">This is a simulated receipt generated by the Trust Bank ATM demo. Not a real financial document.</p>
    `;
}

function buildReceiptText() {
    const data = getReceiptData();
    const lines = [
        'TRUST BANK — ACCOUNT STATEMENT',
        `Terminal ${data.terminalId} · ${data.accountHolder}`,
        `Generated: ${data.generatedAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`,
        `Available Balance: $${formatMoney(data.balance)}`,
        '',
        'DATE                TYPE        AMOUNT       DESCRIPTION'
    ];

    if (data.transactions.length === 0) {
        lines.push('No transactions yet.');
    } else {
        data.transactions.forEach((tx) => {
            const sign = tx.type === 'Deposit' ? '+' : '-';
            const dateStr = formatTransactionDate(tx.date).padEnd(20, ' ');
            const typeStr = tx.type.padEnd(12, ' ');
            const amountStr = `${sign}$${tx.amount.toFixed(2)}`.padEnd(13, ' ');
            lines.push(`${dateStr}${typeStr}${amountStr}${tx.description}`);
        });
    }

    lines.push('', 'This is a simulated receipt generated by the Trust Bank ATM demo.');
    return lines.join('\n');
}

function downloadReceiptAsFile() {
    const blob = new Blob([buildReceiptText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trust-bank-receipt-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
        try {
            renderPrintReceipt();
            if (typeof window.print === 'function') {
                window.print();
            } else {
                downloadReceiptAsFile();
            }
        } catch (err) {
            console.error('Print receipt failed, falling back to download:', err);
            try {
                downloadReceiptAsFile();
            } catch (fallbackErr) {
                console.error('Receipt download fallback also failed:', fallbackErr);
                showModal('error', 'Receipt Unavailable', 'We could not prepare your receipt right now. Please try again.');
            }
        }
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

// ==== Shared constants ====
const PIN_LENGTH = 4;
const MAX_AMOUNT_DIGITS = 6;
const CORRECT_PIN = "1234";
const DAILY_WITHDRAWAL_LIMIT = 500;

// ==== Deposit Flow ====
// Steps: 1 = Amount, 2 = Verify, 3 = PIN, 4 = Processing/Confirm

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

// Physical keyboard support — only while logged in and on the deposit screen
document.addEventListener('keydown', (e) => {
    if (appShell.classList.contains('hidden')) return;
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

// ---- Stepper visuals (shared by both deposit and withdrawal steppers) ----
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

// ---- Main render: draws whichever deposit step is active ----

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
            saveBalance();
            renderBalance();
            addTransaction('Deposit', amount, accountBalance);
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

// ==== Withdrawal Flow ====
// Mirrors the deposit flow exactly: 1 = Amount, 2 = Verify, 3 = PIN, 4 = Processing/Confirm.
// The only difference is Step 1 also shows a quick-amount grid beside the keypad.

let wdCurrentStep = 1;
let withdrawalAmountString = "";
let wdPinString = "";

const wdNumButtons = document.querySelectorAll('.withdrawal-keypad-num');
const wdClearBtn = document.getElementById('btn-withdrawal-clear');
const wdBackspaceBtn = document.getElementById('btn-withdrawal-backspace');
const wdConfirmBtn = document.getElementById('btn-withdrawal-action');
const wdCancelBtn = document.getElementById('btn-withdrawal-cancel');
const withdrawalTitle = document.getElementById('withdrawal-title');
const withdrawalInstructions = document.getElementById('withdrawal-instructions');
const withdrawalDisplayContainer = document.getElementById('withdrawal-display-container');
const withdrawalScreen = document.getElementById('screen-withdrawal');
const withdrawalQuickSelect = document.getElementById('withdrawal-quick-select');
const quickAmountButtons = document.querySelectorAll('.quick-amount-btn');

const wdStepAmountDot = document.getElementById('wd-step-amount-dot');
const wdStepAmountGroup = document.getElementById('wd-step-amount-group');
const wdStepVerifyDot = document.getElementById('wd-step-verify-dot');
const wdStepVerifyGroup = document.getElementById('wd-step-verify-group');
const wdStepPinDot = document.getElementById('wd-step-pin-dot');
const wdStepPinGroup = document.getElementById('wd-step-pin-group');
const wdStepConfirmDot = document.getElementById('wd-step-confirm-dot');
const wdStepConfirmGroup = document.getElementById('wd-step-confirm-group');

function handleWithdrawalDigit(digit) {
    if (wdCurrentStep === 1) {
        if (withdrawalAmountString.length >= MAX_AMOUNT_DIGITS) return;
        if (withdrawalAmountString === "" && digit === "0") return;
        withdrawalAmountString += digit;
        renderWithdrawalAmountDisplay();
    } else if (wdCurrentStep === 3) {
        if (wdPinString.length >= PIN_LENGTH) return;
        wdPinString += digit;
        renderWithdrawalPinDisplay();
    }
}

function handleWithdrawalBackspace() {
    if (wdCurrentStep === 1) {
        withdrawalAmountString = withdrawalAmountString.slice(0, -1);
        renderWithdrawalAmountDisplay();
    } else if (wdCurrentStep === 3) {
        wdPinString = wdPinString.slice(0, -1);
        renderWithdrawalPinDisplay();
    }
}

function handleWithdrawalClear() {
    if (wdCurrentStep === 1) {
        withdrawalAmountString = "";
        renderWithdrawalAmountDisplay();
    } else if (wdCurrentStep === 3) {
        wdPinString = "";
        renderWithdrawalPinDisplay();
    }
}

wdNumButtons.forEach(button => {
    button.addEventListener('click', () => handleWithdrawalDigit(button.textContent.trim()));
});
wdBackspaceBtn.addEventListener('click', handleWithdrawalBackspace);
wdClearBtn.addEventListener('click', handleWithdrawalClear);

// Quick-amount presets only apply while on the Amount step
quickAmountButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (wdCurrentStep !== 1) return;
        const presetAmount = button.getAttribute('data-amount');
        withdrawalAmountString = String(parseInt(presetAmount, 10));
        renderWithdrawalAmountDisplay();
    });
});

// Physical keyboard support — only while logged in and on the withdrawal screen
document.addEventListener('keydown', (e) => {
    if (appShell.classList.contains('hidden')) return;
    if (withdrawalScreen.classList.contains('hidden')) return;

    if (e.key >= '0' && e.key <= '9') {
        handleWithdrawalDigit(e.key);
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleWithdrawalBackspace();
    } else if (e.key === 'Enter') {
        wdConfirmBtn.click();
    } else if (e.key === 'Escape') {
        wdCancelBtn.click();
    }
});

function renderWithdrawalAmountDisplay() {
    const amount = withdrawalAmountString === "" ? "0" : parseInt(withdrawalAmountString, 10);
    withdrawalDisplayContainer.innerHTML = `
        <span class="flex items-end gap-1">
            <p class="text-lg">$</p>
            <p class="text-5xl font-bold tracking-wider">${amount}.00</p>
        </span>
    `;
}

function renderWithdrawalVerifyDisplay() {
    const amount = withdrawalAmountString === "" ? "0" : parseInt(withdrawalAmountString, 10);
    withdrawalDisplayContainer.innerHTML = `
        <p class="text-[11px] uppercase tracking-widest text-[#8e9098] mb-1">You are about to withdraw</p>
        <span class="flex items-end gap-1">
            <p class="text-lg">$</p>
            <p class="text-5xl font-bold tracking-wider">${amount}.00</p>
        </span>
    `;
}

function renderWithdrawalPinDisplay() {
    let dots = "";
    for (let i = 0; i < PIN_LENGTH; i++) {
        const filled = i < wdPinString.length;
        dots += `<span class="inline-block w-4 h-4 rounded-full mx-2 ${filled ? 'bg-[#b2c7ef]' : 'bg-[#343537] border border-[#44474e]'}"></span>`;
    }
    withdrawalDisplayContainer.innerHTML = `<div class="flex items-center justify-center py-5">${dots}</div>`;
}

function renderWithdrawalStepFlow() {
    setStepDotState(wdStepAmountDot, wdStepAmountGroup, wdCurrentStep === 1);
    setStepDotState(wdStepVerifyDot, wdStepVerifyGroup, wdCurrentStep === 2);
    setStepDotState(wdStepPinDot, wdStepPinGroup, wdCurrentStep === 3);
    setStepDotState(wdStepConfirmDot, wdStepConfirmGroup, wdCurrentStep === 4);

    wdConfirmBtn.disabled = false;
    wdConfirmBtn.classList.remove('opacity-60', 'cursor-not-allowed');

    // The quick-amount grid only makes sense while choosing the amount
    withdrawalQuickSelect.classList.toggle('hidden', wdCurrentStep !== 1);

    if (wdCurrentStep === 1) {
        withdrawalTitle.textContent = "Select withdrawal amount";
        withdrawalInstructions.textContent = "Choose a quick amount or use the keypad, then continue.";
        wdConfirmBtn.innerHTML = `<span>Next: Verify</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        renderWithdrawalAmountDisplay();
    } else if (wdCurrentStep === 2) {
        withdrawalTitle.textContent = "Verify your withdrawal";
        withdrawalInstructions.textContent = "Double check the amount below before continuing.";
        wdConfirmBtn.innerHTML = `<span>Continue</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`;
        renderWithdrawalVerifyDisplay();
    } else if (wdCurrentStep === 3) {
        withdrawalTitle.textContent = "Enter your PIN";
        withdrawalInstructions.textContent = "Enter your 4-digit PIN to authorize this withdrawal.";
        wdConfirmBtn.innerHTML = `<span>Confirm Withdrawal</span> <i data-lucide="circle-check" class="w-4 h-4"></i>`;
        renderWithdrawalPinDisplay();
    } else if (wdCurrentStep === 4) {
        withdrawalTitle.textContent = "Processing";
        withdrawalInstructions.textContent = "Transaction executing securely. Do not close this terminal.";
        wdConfirmBtn.innerHTML = `<span>Processing...</span> <i data-lucide="loader" class="w-4 h-4 animate-spin"></i>`;
        wdConfirmBtn.disabled = true;
        wdConfirmBtn.classList.add('opacity-60', 'cursor-not-allowed');

        const amount = parseInt(withdrawalAmountString, 10);
        setTimeout(() => {
            accountBalance -= amount;
            saveBalance();
            renderBalance();
            addTransaction('Withdrawal', amount, accountBalance);
            resetWithdrawalFlow();
            switchScreen('screen-home');
            showModal('success', 'Withdrawal Successful', `$${amount}.00 has been dispensed. Your new balance is $${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
        }, 2500);
    }

    if (window.lucide) lucide.createIcons();
}

function resetWithdrawalFlow() {
    withdrawalAmountString = "";
    wdPinString = "";
    wdCurrentStep = 1;
    renderWithdrawalStepFlow();
}

wdConfirmBtn.addEventListener('click', () => {
    if (wdCurrentStep === 1) {
        const amount = parseInt(withdrawalAmountString, 10) || 0;
        if (!amount) {
            showModal('error', 'Invalid Amount', 'Please enter an amount greater than $0 first.');
            return;
        }
        if (amount > DAILY_WITHDRAWAL_LIMIT) {
            showModal('error', 'Daily Limit Exceeded', `You can withdraw up to $${DAILY_WITHDRAWAL_LIMIT.toFixed(2)} per day.`);
            return;
        }
        if (amount > accountBalance) {
            showModal('error', 'Insufficient Funds', 'This amount exceeds your available balance.');
            return;
        }
        wdCurrentStep = 2;
    } else if (wdCurrentStep === 2) {
        wdCurrentStep = 3;
    } else if (wdCurrentStep === 3) {
        if (wdPinString.length !== PIN_LENGTH) {
            showModal('error', 'Incomplete PIN', 'Please enter your full 4-digit PIN.');
            return;
        }
        if (wdPinString !== CORRECT_PIN) {
            showModal('error', 'Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
            wdPinString = "";
            renderWithdrawalPinDisplay();
            return;
        }
        wdCurrentStep = 4;
    }
    renderWithdrawalStepFlow();
});

wdCancelBtn.addEventListener('click', () => {
    resetWithdrawalFlow();
    switchScreen('screen-home');
});

// ==== Login / Logout (frontend-only session gate) ====
// NOTE: these credentials are hardcoded client-side for demo purposes only.
// This is not real authentication — anyone can read them in this file.
const VALID_USERNAME = "alexjohnson";
const VALID_PASSWORD = "trust1234";

const screenLogin = document.getElementById('screen-login');
const appShell = document.getElementById('app-shell');
const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const loginErrorText = document.getElementById('login-error-text');
const lastAccessValueEl = document.getElementById('last-access-value');

function showLoginScreen() {
    screenLogin.classList.remove('hidden');
    appShell.classList.add('hidden');
    appShell.classList.remove('flex');
    loginPasswordInput.value = "";
    loginError.classList.add('hidden');
    loginUsernameInput.focus();
}

function showAppShell() {
    screenLogin.classList.add('hidden');
    appShell.classList.remove('hidden');
    appShell.classList.add('flex');

    const savedScreen = localStorage.getItem('activeATMScreen');
    switchScreen(savedScreen || 'screen-home');
}

function attemptLogin(username, password) {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem('atmLoggedIn', 'true');

        // "Last access" shows the previous session's login time, then we stamp a new one
        const previousAccess = localStorage.getItem('atmLastAccess');
        if (lastAccessValueEl) {
            lastAccessValueEl.textContent = previousAccess
                ? new Date(previousAccess).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                : 'First login';
        }
        localStorage.setItem('atmLastAccess', new Date().toISOString());

        showAppShell();
        return true;
    }
    return false;
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = attemptLogin(loginUsernameInput.value.trim(), loginPasswordInput.value);
    if (!success) {
        loginErrorText.textContent = "Incorrect username or password. Please try again.";
        loginError.classList.remove('hidden');
        loginPasswordInput.value = "";
        loginPasswordInput.focus();
    }
});

btnLogout.addEventListener('click', () => {
    // Balance and transaction history are intentionally left in localStorage —
    // only the login flag is cleared, so logging back in restores everything.
    localStorage.removeItem('atmLoggedIn');
    resetDepositFlow();
    resetWithdrawalFlow();
    localStorage.setItem('activeATMScreen', 'screen-home');
    showLoginScreen();
});

// ==== Initial render ====

renderBalance();
renderTransactionHistory();
renderStepFlow();
renderWithdrawalStepFlow();

if (localStorage.getItem('atmLoggedIn') === 'true') {
    showAppShell();
} else {
    showLoginScreen();
}