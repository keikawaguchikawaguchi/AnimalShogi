// 行数
const rowCount = 4;
// 列数
const colCount = 3;

var Game = function (element,logElement) {
    // コンストラクタ
    // Dom
    this.hostElement = element;
    // Dom(log)
    this.logElement = logElement;
    // プレイヤー１
    this.palyer1 = null;
    // プレイヤー２
    this.palyer2 = null;
    // ボード
    this.bord = null;
    // 駒一覧
    this.pieces = [];
    // ターン数
    this.turn = 0;
    // メッセージ表示欄
    this.turnMessage = null;
    //  先行はプレイヤー１
    this.isFirstPlayer1 = false;
}

// ゲーム開始
Game.prototype.playGame = function () {
    // プレイヤーを2人作成する
    this.creatPlayers();

    // ボードを用意する
    this.bord = new Bord(rowCount, colCount);

    // 駒を初期配置する
    this.pieces = createPiecesProcess();
    this.redisplayBord();

    // EventLisnerを設定
    this.hostElement.addEventListener('onMovePieceForPlayer', e => this.movePieceForPlayer(e), false);

    // 先行のターン
    this.turnMessage.textContent = getTrunPlayer(this.turn,this.isFirstPlayer1, this.palyer1, this.palyer2).name + 'の順番です';
    getTrunPlayer(this.turn,this.isFirstPlayer1, this.palyer1, this.palyer2).thinkMovePiece(this.pieces, this.hostElement, this.isFirstPlayer1?this.turn % 2 == 0:this.turn % 2 != 0)
}

// プレイヤーを2人作成する
Game.prototype.creatPlayers = function () {
    //this.palyer1 = new Player('エリザベス');
    this.palyer1 = new ErizabethV1();
    this.palyer2 = new Player('マイケル');
}

// プレイヤーからの入力を受け取る
Game.prototype.movePieceForPlayer = function (event) {
    // 移動をチェックする
    if (!canMove(event.detail.piece, event.detail.x, event.detail.y, this.pieces)) {
        alert('移動できません。');
        this.turnMessage.textContent = getTrunPlayer(this.turn,this.isFirstPlayer1, this.palyer1, this.palyer2).name + 'の順番です';
        return;
    }

    // ログを出力
    COMMON.method.displayMessage((this.turn + 1) + ":" 
        + getTrunPlayer(this.turn,this.isFirstPlayer1, this.palyer1, this.palyer2).name + ":"
        + event.detail.piece.displayString + '(' + (COMMON.method.changeAlphabet(event.detail.piece.x)||'') + ',' + (event.detail.piece.y != null?(event.detail.piece.y + 1):'') + ')'
        + "→" + '(' + COMMON.method.changeAlphabet(event.detail.x) + ',' + (event.detail.y != null?(event.detail.y + 1):null) + ')'
        ,this.logElement
    )

    // 移動先の駒を取る
    let targetPieceIndex = this.pieces.findIndex((value) => {
        return value.x == event.detail.x && value.y == event.detail.y;
    });
    if (targetPieceIndex != -1) {
        this.pieces[targetPieceIndex].movePiece(null, null, this.isFirstPlayer1?this.turn % 2 == 0:this.turn % 2 != 0);
        // にわとりはひよこにもどす
        if (this.pieces[targetPieceIndex].typeId == PIECE_TYPE.NIWATORI) {
            this.pieces[targetPieceIndex].changeType(getPieceTypeName(PIECE_TYPE.HIYOKO), PIECE_TYPE.HIYOKO);
        }
    }

    // 移動する
    event.detail.piece.movePiece(event.detail.x, event.detail.y, this.isFirstPlayer1?this.turn % 2 == 0:this.turn % 2 != 0);
    // ひよこをにわとりにする
    if (event.detail.piece.typeId == PIECE_TYPE.HIYOKO &&
        ((this.isFirstPlayer1?this.turn % 2 != 0:this.turn % 2 == 0 && event.detail.y == 0) || (this.isFirstPlayer1?this.turn % 2 == 0:this.turn % 2 != 0 && event.detail.y == rowCount - 1))) {
        event.detail.piece.changeType(getPieceTypeName(PIECE_TYPE.NIWATORI), PIECE_TYPE.NIWATORI);
    }

    // 画面を更新
    this.redisplayBord();

    // 勝敗を確認
    let winPlayer = getWinPalyer(this.pieces, this.palyer1, this.palyer2, this.turn)
    if (winPlayer) {
        alert('勝敗が決まりました');
        this.turnMessage.textContent = winPlayer.name + 'の勝ちです';
        return;
    }

    // 次のターンに移行
    this.turn++;
    let nextPlayer = getTrunPlayer(this.turn,this.isFirstPlayer1, this.palyer1, this.palyer2)
    this.turnMessage.textContent = nextPlayer.name + 'の順番です';
    nextPlayer.thinkMovePiece(this.pieces, this.hostElement, this.isFirstPlayer1?this.turn % 2 == 0:this.turn % 2 != 0)
}

// ボードを再表示する
Game.prototype.redisplayBord = function () {
    this.hostElement.textContent = null;
    COMMON.method.displayMessage('Player1:' + this.palyer1.name, this.hostElement);
    this.bord.displayBord(this.pieces, this.hostElement);
    COMMON.method.displayMessage('Player2:' + this.palyer2.name, this.hostElement);
    this.turnMessage = document.createElement('div');
    this.hostElement.appendChild(this.turnMessage);
}

// 現在のターンのプレイヤーを取得する
var getTrunPlayer = function (turn,isFirstPlayer1, player1, player2) {
    if (turn % 2 == 0) {
        return isFirstPlayer1?player1:player2;
    }
    return isFirstPlayer1?player2:player1;
}

// 初期配置の駒一覧を作成する
var createPiecesProcess = function () {
    let rtnValues = [];
    let pieces1 = new Piece(getPieceTypeName(PIECE_TYPE.HIYOKO), PIECE_TYPE.HIYOKO);
    pieces1.movePiece(1, 1, true);
    rtnValues.push(pieces1);

    let pieces2 = new Piece(getPieceTypeName(PIECE_TYPE.ZOU), PIECE_TYPE.ZOU);
    pieces2.movePiece(2, 0, true);
    rtnValues.push(pieces2);

    let pieces3 = new Piece(getPieceTypeName(PIECE_TYPE.RAION), PIECE_TYPE.RAION);
    pieces3.movePiece(1, 0, true);
    rtnValues.push(pieces3);

    let pieces4 = new Piece(getPieceTypeName(PIECE_TYPE.KIRIN), PIECE_TYPE.KIRIN);
    pieces4.movePiece(0, 0, true);
    rtnValues.push(pieces4);

    let pieces5 = new Piece(getPieceTypeName(PIECE_TYPE.HIYOKO), PIECE_TYPE.HIYOKO);
    pieces5.movePiece(1, 2, false);
    rtnValues.push(pieces5);

    let pieces6 = new Piece(getPieceTypeName(PIECE_TYPE.ZOU), PIECE_TYPE.ZOU);
    pieces6.movePiece(0, 3, false);
    rtnValues.push(pieces6);

    let pieces7 = new Piece(getPieceTypeName(PIECE_TYPE.RAION), PIECE_TYPE.RAION);
    pieces7.movePiece(1, 3, false);
    rtnValues.push(pieces7);

    let pieces8 = new Piece(getPieceTypeName(PIECE_TYPE.KIRIN), PIECE_TYPE.KIRIN);
    pieces8.movePiece(2, 3, false);
    rtnValues.push(pieces8);

    return rtnValues;
}

// 移動をチェックする
var canMove = function (piece, x, y, pieces) {
    let findIndex = canNextMovePlace(piece,pieces).findIndex((value=>{
        return x == value.x && y == value.y;
    }));

    return findIndex != -1;
}

// 勝敗を確認
var getWinPalyer = function (pieces, player1, player2, turn,isFirstPlayer1) {
    // キャッチ
    let kingPieceIndex = pieces.findIndex((value) => {
        return value.typeId == PIECE_TYPE.RAION && value.isPlayer1Piece;
    });
    if (kingPieceIndex == -1) {
        return player2;
    }

    let kingPieceIndex2 = pieces.findIndex((value) => {
        return value.typeId == PIECE_TYPE.RAION && !value.isPlayer1Piece;
    });
    if (kingPieceIndex2 == -1) {
        return player1;
    }

    // タッチダウン
    if (isFirstPlayer1?turn % 2 == 0:turn % 2 != 0) {
        if (pieces[kingPieceIndex].y == rowCount - 1) {
            let killFlg = false;
            for(let i in pieces){
                if(!pieces[i].isPlayer1Piece && canMove(pieces[i],pieces[kingPieceIndex].x,pieces[kingPieceIndex].y,pieces)){
                    killFlg = true;
                    break;
                }
            }
            if(!killFlg){
                return player1;
            }
        }
    } else {
        if (pieces[kingPieceIndex2].y == 0) {
            let killFlg = false;
            for(let i in pieces){
                if(pieces[i].isPlayer1Piece && canMove(pieces[i],pieces[kingPieceIndex2].x,pieces[kingPieceIndex2].y,pieces)){
                    killFlg = true;
                    break;
                }
            }
            if(!killFlg){
                return player2;
            }
        }
    }
    return null;
}

// 次に打てる場所一覧
var canNextMovePlace = function(piece,pieces){
    let rtnValues = [];

    // 持ち駒を移動
    if(piece.x == null || piece.y == null){
        for(let i = 0;i <= colCount - 1;i++){
            for(let j = 0;j <= rowCount - 1;j++){
                let targetIndex = pieces.findIndex((value) => {
                    return value.x == i && value.y == j;
                });
                if(targetIndex == -1){
                    rtnValues.push({x:i,y:j});     
                }
            }
        }
        return rtnValues;
    }

    // 盤面の駒を移動
    switch (piece.typeId) {
        case PIECE_TYPE.HIYOKO:
            if (piece.isPlayer1Piece) {
                if(intoBoad(piece.x,piece.y + 1) && !existMyPiece(piece.x,piece.y + 1,piece,pieces)){
                    rtnValues.push({x:piece.x,y:piece.y + 1});
                }
            } else {
                if(intoBoad(piece.x,piece.y - 1) && !existMyPiece(piece.x,piece.y - 1,piece,pieces)){
                    rtnValues.push({x:piece.x,y:piece.y - 1});
                }
            }
            return rtnValues;
        case PIECE_TYPE.RAION:
            // 上
            if(intoBoad(piece.x,piece.y -1) && !existMyPiece(piece.x,piece.y -1,piece,pieces)){
                rtnValues.push({x:piece.x,y:piece.y -1});
            }
            // 右上
            if(intoBoad(piece.x + 1,piece.y - 1 ) && !existMyPiece(piece.x + 1,piece.y - 1,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y - 1});
            }
            // 右
            if(intoBoad(piece.x + 1,piece.y ) && !existMyPiece(piece.x + 1,piece.y,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y});
            }
            // 右下
            if(intoBoad(piece.x + 1,piece.y + 1 ) && !existMyPiece(piece.x + 1,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y + 1});
            }
            // 下
            if(intoBoad(piece.x,piece.y + 1 ) && !existMyPiece(piece.x,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x,y:piece.y + 1});
            }
            // 左下
            if(intoBoad(piece.x - 1,piece.y + 1 ) && !existMyPiece(piece.x - 1,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y + 1});
            }
            // 左
            if(intoBoad(piece.x - 1,piece.y ) && !existMyPiece(piece.x - 1,piece.y,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y});
            }
            // 左上
            if(intoBoad(piece.x - 1,piece.y　- 1 ) && !existMyPiece(piece.x - 1,piece.y　- 1,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y　- 1});
            }
            return rtnValues;
        case PIECE_TYPE.ZOU:
            // 右上
            if(intoBoad(piece.x + 1,piece.y - 1 ) && !existMyPiece(piece.x + 1,piece.y - 1,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y - 1});
            }
            // 右下
            if(intoBoad(piece.x + 1,piece.y + 1 ) && !existMyPiece(piece.x + 1,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y + 1});
            }
            // 左下
            if(intoBoad(piece.x - 1,piece.y + 1 ) && !existMyPiece(piece.x - 1,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y + 1});
            }
            // 左上
            if(intoBoad(piece.x - 1,piece.y　- 1 ) && !existMyPiece(piece.x - 1,piece.y　- 1,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y　- 1});
            }
            return rtnValues;
        case PIECE_TYPE.KIRIN:
            // 上
            if(intoBoad(piece.x,piece.y -1) && !existMyPiece(piece.x,piece.y -1,piece,pieces)){
                rtnValues.push({x:piece.x,y:piece.y -1});
            }
            // 右
            if(intoBoad(piece.x + 1,piece.y ) && !existMyPiece(piece.x + 1,piece.y,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y});
            }
            // 下
            if(intoBoad(piece.x,piece.y + 1 ) && !existMyPiece(piece.x,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x,y:piece.y + 1});
            }
            // 左
            if(intoBoad(piece.x - 1,piece.y ) && !existMyPiece(piece.x - 1,piece.y,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y});
            }
            return rtnValues;
        case PIECE_TYPE.NIWATORI:
            // 上
            if(intoBoad(piece.x,piece.y -1) && !existMyPiece(piece.x,piece.y -1,piece,pieces)){
                rtnValues.push({x:piece.x,y:piece.y -1});
            }
            // 右上
            if(intoBoad(piece.x + 1,piece.y - 1 ) && !piece.isPlayer1Piece && !existMyPiece(piece.x + 1,piece.y - 1,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y - 1});
            }
            // 右
            if(intoBoad(piece.x + 1,piece.y ) && !existMyPiece(piece.x + 1,piece.y,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y});
            }
            // 右下
            if(intoBoad(piece.x + 1,piece.y + 1 ) && !piece.isPlayer1Piece && !existMyPiece(piece.x + 1,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x + 1,y:piece.y + 1});
            }
            // 下
            if(intoBoad(piece.x,piece.y + 1 ) && !existMyPiece(piece.x,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x,y:piece.y + 1});
            }
            // 左下
            if(intoBoad(piece.x - 1,piece.y + 1 ) && piece.isPlayer1Piece && !existMyPiece(piece.x - 1,piece.y + 1,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y + 1});
            }
            // 左
            if(intoBoad(piece.x - 1,piece.y ) && !existMyPiece(piece.x - 1,piece.y,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y});
            }
            // 左上
            if(intoBoad(piece.x - 1,piece.y　- 1 ) && piece.isPlayer1Piece && !existMyPiece(piece.x - 1,piece.y　- 1,piece,pieces)){
                rtnValues.push({x:piece.x - 1,y:piece.y　- 1});
            }
            return rtnValues;
    }
}

// 盤にはいっているかどうか
var intoBoad = function(x,y){
    return x >= 0 && x <= colCount - 1 && y >= 0 && y <= rowCount - 1
}

// 行先に自分の駒があるかどうか
var existMyPiece= function(x,y,piece,pieces){
    let index = pieces.findIndex(value => {
        return value.x == x && value.y == y && piece.isPlayer1Piece == value.isPlayer1Piece;
    });

    return index != -1;
}

// 駒種別
var PIECE_TYPE = {
    RAION: 0,
    ZOU: 1,
    KIRIN: 2,
    HIYOKO: 3,
    NIWATORI: 4
};

// 駒種別名
var getPieceTypeName = function (pieceType) {
    let names = ['ラ', 'ぞ', 'き', 'ひ', 'に'];

    return names[pieceType];
}