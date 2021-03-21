var COMMON = COMMON || {};
COMMON.method = {
    displayMessage:function(message,element){
        var div = document.createElement('div');
        div.textContent = message;

        // 最後の子要素として追加
        element.appendChild(div);
    },

    // 数値をアルファベットに変換する
    changeAlphabet:function(input){
        let althbetArray = ['A','B','C'];

        return althbetArray[input]||null;
    }
}