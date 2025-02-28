let rentOption = false;
let buyOption = false;

function handleRent() {
    rentOption = true;
    buyOption = false;
    window.location.href = 'incomeSelector.html';
}

function handleBuy() {
    rentOption = false;
    buyOption = true;
    window.location.href = 'incomeSelector.html';
}