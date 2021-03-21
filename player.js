var Player = function(name){
    // コンストラクタ
    // 名前
    this.name = name;
}

// 駒を移動する
Player.prototype.thinkMovePiece = function(pieces,element,isPlayer1Turn){
    // ドロップダウン作成
    let dropDown = document.createElement('select');
    dropDown.id = 'piece-select';
    for(let i in pieces){
        if(pieces[i].isPlayer1Piece != isPlayer1Turn){
            continue;
        }
        let option = document.createElement('option');
        if(pieces[i].x == null || pieces[i].y == null){
            option.text = pieces[i].displayString
        }else{
            option.text = pieces[i].displayString + '(' + COMMON.method.changeAlphabet(pieces[i].x) + ',' + (pieces[i].y != null?(pieces[i].y + 1):null) + ')';
        }
        option.value = i;
        dropDown.appendChild(option);
    }
    element.appendChild(dropDown);

    // 座標入力欄を追加
    let inputX = document.createElement('select');
    inputX.id = 'input-x';
    inputX.style.marginLeft = '15px';

    let optionA = document.createElement('option');
    optionA.text = 'A';
    optionA.value = 0;
    inputX.appendChild(optionA);

    let optionB = document.createElement('option');
    optionB.text = 'B';
    optionB.value = 1;
    inputX.appendChild(optionB);

    let optionC = document.createElement('option');
    optionC.text = 'C';
    optionC.value = 2;
    inputX.appendChild(optionC);
    
    element.appendChild(inputX);

    let inputY = document.createElement('select');
    inputY.id = 'input-y';
    inputY.style.marginLeft = '15px';
    
    let option1 = document.createElement('option');
    option1.text = '1';
    option1.value = 0;
    inputY.appendChild(option1);

    let option2 = document.createElement('option');
    option2.text = '2';
    option2.value = 1;
    inputY.appendChild(option2);

    let option3 = document.createElement('option');
    option3.text = '3';
    option3.value = 2;
    inputY.appendChild(option3);

    let option4 = document.createElement('option');
    option4.text = '4';
    option4.value = 3;
    inputY.appendChild(option4);

    element.appendChild(inputY);

    // 決定ボタンを追加
    let commitButton = document.createElement('input');
    commitButton.type = 'button';
    commitButton.value = '決定';
    commitButton.style.marginLeft = '15px';
    element.appendChild(commitButton);

    // 決定ボタンEventLisnerを追加
    commitButton.addEventListener('click',e => this.thinkMovePieceEvemt(pieces,element), false);
}

// 駒を移動するEventを発火する
Player.prototype.thinkMovePieceEvemt = function(pieces,element){
    let dropDown = document.getElementById('piece-select'); 
    let inputX = document.getElementById('input-x');
    let inputY = document.getElementById('input-y');

    // カスタムイベントを発火
    var event = new CustomEvent('onMovePieceForPlayer',{detail:{piece:pieces[dropDown.value],x:Number(inputX.value),y:Number(inputY.value)}});
    element.dispatchEvent(event);
}
