function RollSixSidedDie() {
    document.getElementById("die6").value = Math.floor(Math.random()*6)+1;

    var dieImage = document.getElementById("die6Image");
    dieImage.style.animation = 'jump 0.5s linear';
    setTimeout(function() {
        dieImage.style.animation = 'none';
    }, 500);
}

function RollEightSidedDie() {
    document.getElementById("die8").value = Math.floor(Math.random()*8)+1;
}

function initApp() {
    RollSixSidedDie();
    RollEightSidedDie();
}
