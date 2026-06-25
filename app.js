'use strict';

const allScreens = document.querySelectorAll('.view-screen');

const btnHome = document.getElementById('btn-home');
const btnDeposit = document.getElementById('btn-deposit');
const btnWithdrawal = document.getElementById('btn-withdrawal');
const btnHistory = document.getElementById('btn-history');

function switchScreen(targetScreenId) {
    allScreens.forEach(screen => {
        screen.classList.add('hidden');
    })

    const activeScreen = document.getElementById(targetScreenId);
    activeScreen.classList.remove('hidden');
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