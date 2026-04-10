let timer;
let timeLeft = 5;

function startRedirection() {
    const overlay = document.getElementById('shop-overlay');
    const display = document.getElementById('countdown');
    overlay.style.display = 'flex';
    timeLeft = 5;
    display.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        display.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            window.location.href = "https://ko-fi.com/cmha31";
        }
    }, 1000);
}

function cancelRedirection() {
    clearInterval(timer);
    document.getElementById('shop-overlay').style.display = 'none';
}