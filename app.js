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
    })

    const activeScreen = document.getElementById(targetScreenId);
    if (activeScreen) {
        activeScreen.classList.remove('hidden');

        localStorage.setItem('activeATMScreen', targetScreenId);
    }
}

const savedScreen = localStorage.getItem('activeATMScreen');

if (savedScreen) {
    switchScreen(savedScreen)
} else {
    switchScreen('screen-home')
}

btnHome.addEventListener('click', () => {
    switchScreen('screen-home');
});

btnDeposit.addEventListener('click', () => {
    switchScreen('screen-deposit');
});

btnWithdrawal.addEventListener('click', () => {
    switchScreen('screen-withdrawal');
});

btnHistory.addEventListener('click', () => {
    switchScreen('screen-history');
});

// Home screen buttons
const dashboardDepositBtn = document.getElementById('dashboard-deposit-btn')
const dashboardWithdrawBtn = document.getElementById('dashboard-withdraw-btn')
const dashboardHistoryBtn = document.getElementById('dashboard-history-btn')

dashboardDepositBtn.addEventListener('click', () => {
    switchScreen('screen-deposit');
});

dashboardWithdrawBtn.addEventListener('click', () => {
    switchScreen('screen-withdrawal');
});

dashboardHistoryBtn.addEventListener('click', () => {
    switchScreen('screen-history')
})

// Deposit Logic
let depositInputString = "";

const displayElement = document.getElementById('deposit-display');
const numButtons = document.querySelectorAll('.keypad-num');
const clearBtn = document.getElementById('btn-clear');
const backspaceBtn = document.getElementById('btn-backspace');

function updateDisplay() {
    if (depositInputString === "" || depositInputString === "0") {
        displayElement.textContent = "0.00"
        return;
    } 

    const centsAmount = parseInt(depositInputString, 10);
    const dollarAmount = centsAmount/ 100;

    displayElement.textContent = dollarAmount.toFixed(2);
}

numButtons.forEach(button => {
    button.addEventListener('click', () => {
        const valueClicked = button.textContent.trim();

        if (depositInputString.length >= 7) return;
        if (depositInputString === "" && valueClicked === "0") return;

        depositInputString += valueClicked;

        updateDisplay();
    });
});

backspaceBtn.addEventListener('click', () => {
    depositInputString = depositInputString.slice(0, -1);
    updateDisplay();
});

clearBtn.addEventListener('click', () => {
    depositInputString = "";
    updateDisplay();
});

let currentStep = 1;
let maxSteps = 3;

const instructionsText = document.getElementById('deposit-instructions');
const confirmBtn = document.querySelector('#screen-deposit button class*="bg-[#006bb5]"' || document.getElementById('btn-deposit-confirm') || document.querySelector('.bg-\\[\\#006bb5\\]'));

const stepVerifyDot = document.getElementById('step-verify-dot');
const stepVerifyGroup = document.getElementById('step-verify-group');
const stepConfirmDot = document.getElementById('step-confirm-dot');
const stepConfirmGroup = document.getElementById('step-confirm-group');
const line1 = document.getElementById('line-1');
const line2 = document.getElementById('line-2');

function renderStepflow() {
    // AMOUNT LOOKS 
    if (currentStep === 1) {
        instructionsText.textContent = "Please use the keypad to specify your deposit total."
        confirmBtn.innerHTML = `<span>Next: Verify</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>`

        // Reset verify dot to inactive gray circle state
        stepVerifyDot.className = "w-3 h-3 rounded-full bg-[#343537] transition-all duration-300 flex items-center justify-center border border-transparent";
        stepVerifyDot.innerHTML = "";
        stepVerifyGroup.querySelector('span').className = "text-[10px] font-bold uppercase tracking-widest text-[#8e9098]"
        line1.className = "flex-1  mx-1 bg-[#343537] -translate-y-3.5 transition-colors duration-300"

    }

    // VERIFY LOOKS
    else if(currentStep === 2) {
        instructionsText.textContent = "Review your input amount. Press continue to prepare the transaction encryption."
        confirmBtn.innerHTML = `<span>Submit & Confirm</span> <i data-lucide="circle-check" class="w-4 h-4"></i>`

        // Transform Verify Dot to Active Glowing Inner Blue Core Ring
        stepVerifyDot.className = "w-5 h-5 rounded-full bg-[#1a3150] flex items-center justify-center border border-[#b2c7ef4d] shadow-[0_0_12px_rgba(178,199,239,0.2)] transition-all duration-300";
        stepVerifyDot.innerHTML = `<div class="w-3 h-3 rounded-full bg-[#b2c7ef]"></div>`;
        stepVerifyGroup.querySelector('span').className = "text-[10px] font-bold uppercase tracking-wider text-[#b2c7ef]";

        line1.className = "flex-1 h-0.5 mx-1 bg-[#b2c7ef4d] -translate-y-3.5 transition-colors duration-300";

        // Confirm dot remains stale
        stepConfirmDot.className = "w-3.5 h-3.5 rounded-full bg-[#343537] transition-all duration-300 flex items-center justify-center border border-transparent";
        stepConfirmDot.innerHTML = "";
        stepConfirmGroup.querySelector('span').className = "text-[10px] font-bold uppercase tracking-widest text-[#8e9098]";
        line2.className = "flex-1 h-0.5 bg-[#343537] mx-1 -translate-y-3.5 transition-colors duration-300";
    }

    // CONFIRM LOOKS
    else if (currentStep === 3) {
        instructionsText.textContent = "Transaction executing securely. Do not close this terminal.";
        confirmBtn.innerHTML = `<span>Processing...</span> <i data-lucide="loader" class="w-4 h-4 animate-spin"></i>`;
        
        // Transform Confirm Dot to Active Glowing Ring
        stepConfirmDot.className = "w-5 h-5 rounded-full bg-[#1a3150] flex items-center justify-center border border-[#b2c7ef4d] shadow-[0_0_12px_rgba(178,199,239,0.2)] transition-all duration-300";
        stepConfirmDot.innerHTML = `<div class="w-3 h-3 rounded-full bg-[#b2c7ef]"></div>`;
        stepConfirmGroup.querySelector('span').className = "text-[10px] font-bold uppercase tracking-wider text-[#b2c7ef]";

        line2.className = "flex-1 h-0.5 bg-[#b2c7ef4d] mx-1 -translate-y-3.5 transition-colors duration-300";

        setTimeout(() => {
            alert(`Successfully deposited $${(parseInt(depositInputString, 10) / 100).toFixed(2)}!`);
            // Reset system loop back to beginning
            depositInputString = "";
            currentStep = 1;
            updateDisplay();
            renderStepFlow();
            if(window.lucide) lucide.createIcons()
        }, 2500);
    }
    if (window.lucide) {
        lucide.createIcons();
    }
}

numButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 1) return; // Guard clause stops keypad execution
    });
});

// Primary Action Button Click Hook
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        // Validation Guard: Don't let users submit zero dollars
        if (depositInputString === "" || depositInputString === "0") {
            alert("Please enter an amount greater than $0.00 first.");
            return;
        }

        // Advance the state machine engine
        if (currentStep < maxSteps) {
            currentStep++;
            renderStepFlow();
        }
    });
}