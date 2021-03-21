var Piece = function(display,type){
    // コンストラクタ
    // 表示文字列
    this.displayString = display;
    // X
    this.x = 0;
    // Y
    this.y = 0;
    // プレイヤー１の駒かどうか
    this.isPlayer1Piece = false;
    // TypeID
    this.typeId = type;
}

// 駒を移動する
Piece.prototype.movePiece = function(x,y,isPlayer1Piece){
    this.x = x;
    this.y = y;
    this.isPlayer1Piece = isPlayer1Piece;
}

// 駒Typeを変更する
Piece.prototype.changeType = function(displayString,typeId){
    this.displayString = displayString;
    this.typeId = typeId;
}

// 駒を表示する
Piece.prototype.displayPiece = function(offsetX,offsetY){
    if(this.x == null || this.y == null){
        return null;
    }

    let pieceDom = document.createElement('div');
    pieceDom.style.height = '104px';
    pieceDom.style.width = '104px';
    pieceDom.style.position = 'absolute';
    pieceDom.style.marginLeft = (offsetX + this.x * 106) + 'px';
    pieceDom.style.marginTop = (offsetY + this.y * 106) + 'px';
    pieceDom.style.textAlign = 'center';
    pieceDom.style.lineHeight = '104px';
    if(this.isPlayer1Piece){
        pieceDom.style.transform = 'rotate(180deg)';
        pieceDom.style.backgroundColor = '#FF66CC';
    }else{
        pieceDom.style.backgroundColor = '#99CCFF';
    }
    pieceDom.textContent = this.displayString;
    

    return pieceDom;
}

