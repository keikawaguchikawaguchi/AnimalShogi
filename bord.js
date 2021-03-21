var Bord = function(rows,cols){
    // コンストラクタ
    // 行数
    this.rows = rows;
    // 列数
    this.cols = cols;
}

// ボード表示機能(更新)
Bord.prototype.displayBord = function(pieces,element){
    // ColHeader作成
    let colHeader = document.createElement('div');
    colHeader.style.marginLeft = '50px';
    colHeader.style.height = '50px';
    colHeader.style.width = (this.cols * 106) + 'px';
    colHeader.style.position = 'absolute';
    colHeader.style.backgroundColor = 'gainsboro';

    for(let i = 0;i < this.cols;i++){
        let colHeaderText = document.createElement('div');
        colHeaderText.style.height = '50px';
        colHeaderText.style.width = '106px';
        colHeaderText.style.position = 'absolute';
        colHeaderText.style.left = (i * 106) + 'px';
        colHeaderText.style.textAlign = 'center';
        colHeaderText.style.lineHeight = '50px';
        colHeaderText.textContent = COMMON.method.changeAlphabet(i);

        colHeader.appendChild(colHeaderText);
    }
    element.appendChild(colHeader);

    // RowHeader作成
    let rowHeader = document.createElement('div');
    rowHeader.style.marginTop = '50px';
    rowHeader.style.height = (this.rows * 106) + 'px';
    rowHeader.style.width = '50px';
    rowHeader.style.position = 'absolute';
    rowHeader.style.backgroundColor = 'gainsboro';

    for(let i = 0;i < this.rows;i++){
        let rowHeaderText = document.createElement('div');
        rowHeaderText.style.height = '106px';
        rowHeaderText.style.width = '50px';
        rowHeaderText.style.position = 'absolute';
        rowHeaderText.style.left = '0px';
        rowHeaderText.style.top = (i * 106) + 'px';
        rowHeaderText.style.textAlign = 'center';
        rowHeaderText.style.lineHeight = '106px';
        rowHeaderText.textContent = (i+1).toString();

        rowHeader.appendChild(rowHeaderText);
    }
    element.appendChild(rowHeader);

    for(let i in pieces){
        let pieceDom = pieces[i].displayPiece(50,50);
        if(pieceDom){
            element.appendChild(pieces[i].displayPiece(50,50));
        }
    }

    // Table作成
    let table = document.createElement('table');
    table.border = 1;
    table.cellSpacing = 1;
    table.style.marginLeft = '50px';
    table.style.marginTop = '50px';
    for(let i = 0;i < this.rows;i++){
        let row = table.insertRow(-1);

        for(let j = 0;j < this.cols;j++){
            let td = row.insertCell(-1);
            td.height = 100;
            td.width = 100;
        }
    }
    element.appendChild(table);

}