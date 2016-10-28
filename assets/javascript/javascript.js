$(document).ready(function() {

    $("#id-start-game").click(function() {
        $(".div-curly, .div-moe, .div-larry, .div-shemp").show();
        $(".div-curly-enemy, .div-moe-enemy, .div-larry-enemy, .div-shemp-enemy").hide();
        $(".div-curly-defender, .div-moe-defender, .div-larry-defender, .div-shemp-defender").hide();
        gameObj.startGame();
    });

    // Choose character funtions
    $(".div-curly").click(function() {
        $(".div-moe, .div-larry, .div-shemp").hide();
        $(".div-moe-enemy, .div-larry-enemy, .div-shemp-enemy").show();
    });
    $(".div-moe").click(function() {
        $(".div-curly, .div-larry, .div-shemp").hide();
        $(".div-curly-enemy, .div-larry-enemy, .div-shemp-enemy").show();
    });
    $(".div-larry").click(function() {
        $(".div-moe, .div-curly, .div-shemp").hide();
        $(".div-moe-enemy, .div-curly-enemy, .div-shemp-enemy").show();
    });
    $(".div-shemp").click(function() {
        $(".div-moe, .div-curly, .div-larry").hide();
        $(".div-moe-enemy, .div-curly-enemy, .div-larry-enemy").show();
    });

    // Choose defender funtions
    $(".div-curly-enemy").click(function() {
        $(".div-curly-enemy").hide();
        $(".div-curly-defender").show();
    });
    $(".div-moe-enemy").click(function() {
        $(".div-moe-enemy").hide();
        $(".div-moe-defender").show();
    });
    $(".div-larry-enemy").click(function() {
        $(".div-larry-enemy").hide();
        $(".div-larry-defender").show();
    });
    $(".div-shemp-enemy").click(function() {
        $(".div-shemp-enemy").hide();
        $(".div-shemp-defender").show();
    });

});