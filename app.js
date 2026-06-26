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