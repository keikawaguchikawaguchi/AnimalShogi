var ErizabethV1 = function(){
    Player.call(this,'エリザベスV１');
}

ErizabethV1.prototype = Object.create(Player.prototype);

ErizabethV1.prototype.constructor = Player;

// 駒を移動する
ErizabethV1.prototype.thinkMovePiece = function(pieces,element,isPlayer1Turn){
    let myPieces;
    let myPiece;
    let candidate;
    let myPlace

    while(!myPlace){
        // 移動する駒をランダムに選ぶ
        myPieces = pieces.filter(value=>{
            return value.isPlayer1Piece == isPlayer1Turn;
        });
        myPiece = myPieces[Math.round(Math.random()*(myPieces.length - 1))];

        // 移動先をランダムに選ぶ
        candidate = canNextMovePlace(myPiece,pieces);
        myPlace = candidate[Math.round(Math.random()*(candidate.length - 1))];
    }

    // カスタムイベントを発火
    var event = new CustomEvent('onMovePieceForPlayer',{detail:{piece:myPiece,x:Number(myPlace.x),y:Number(myPlace.y)}});
    element.dispatchEvent(event);
}
