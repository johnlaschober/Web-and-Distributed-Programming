function RollSixSidedDie() {
    var randomValue = Math.floor(Math.random()*6)+1;
    document.getElementById("die6").value = randomValue;
    document.getElementById("die6ImageText").innerHTML = randomValue;

    var dieImage = document.getElementById("die6Image");
    dieImage.style.animation = 'jump 0.5s linear';
    setTimeout(function() {
        dieImage.style.animation = 'none';
    }, 500);
}

function RollEightSidedDie() {
    var randomValue = Math.floor(Math.random()*8)+1;
    document.getElementById("die8").value = randomValue;
    document.getElementById("die8ImageText").innerHTML = randomValue;

    var dieImage = document.getElementById("die8Image");
    dieImage.style.animation = 'jump 0.5s linear';
    setTimeout(function() {
        dieImage.style.animation = 'none';
    }, 500);
}

function initApp() {
    RollSixSidedDie();
    RollEightSidedDie();
}
