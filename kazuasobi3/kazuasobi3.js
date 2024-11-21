//10進数を平衡三進法の表記へ変換する
function toBalancedTernary(value) {
  let output = "";
  let rem;

  if (value == 0) {
    //0の場合
    output = "0";
  } else if (value > 0) {
    // 0以外の正の整数の場合
    while (value > 0) {
      rem = value % 3;
      value = Math.floor(value / 3);
      if (rem == 2) {
        rem = -1;
        value++;
      }
      output = (rem == 0 ? "0" : rem == 1 ? "1" : "T") + output;
    }
  } else if (value < 0) {
    // 0以外の負の整数の場合(正しく実装できているか自信がないし確かめてもいない)
    while (value < 0) {
      rem = value % 3;
      value = Math.trunc(value / 3);
      if (rem == -2) {
        rem = 1;
        value--;
      }
      output = (rem == 0 ? "0" : rem == 1 ? "1" : "T") + output;
    }
  }

  return output;
}

function isPrime(n) {
  if (n <= 1) return false; // 1以下は素数ではない
  if (n === 2) return true; // 2は素数
  if (n % 2 === 0) return false; // 2以外の偶数は素数ではない
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false; // 割り切れる数があれば素数ではない
  }
  return true; // 素数
}

function generateSumOfPowersOfThree(n) {
  // n == 1 のときは 0 を返す
  if (n === 1) return 0;

  let sum = 0;

  // n-1番目までの3の累乗を合計
  for (let i = 0; i < n - 1; i++) {
    sum += 3 ** i;
  }

  return sum;
}

function generateNestedTable(cellNumber) {
  let balT = toBalancedTernary(cellNumber); // 平衡三進法表記
  const nestedTable = [];
  const rowCount = 2; // 2行の表
  const colCount = balT.length; // 列数は平衡三進法表記の長さに依存

  // 各行を生成
  for (let i = 0; i < rowCount; i++) {
    const row = [];
    for (let j = 0; j < colCount; j++) {
      if (i === 0) {
        // 1行目は平衡三進法の各桁をそのまま格納
        row.push(balT.charAt(j));
      } else if (i === 1) {
        // 2行目は周期を計算
        const num = colCount - j;
        const threePow = 3 ** num;
        const cycle = Math.ceil(
          (cellNumber - generateSumOfPowersOfThree(num)) / threePow
        );
        row.push(cycle);
      }
    }
    nestedTable.push(row);
  }

  return nestedTable;
}

function generateTableData() {
  // 1行目に番号を追加
  const NUM = 3000; //列数
  const headerRow = ["番号", ...Array.from({ length: NUM }, (_, i) => i + 1)];

  // 大きな表を初期化
  const mainTableData = [headerRow];

  // 1行目にラベル「平衡三進法 \n 周期」を追加
  const row = ["平衡三進法 \n 周期"];

  // データを生成
  for (let j = 1; j <= NUM; j++) {
    const nestedTable = generateNestedTable(j);
    row.push(nestedTable);
  }

  // 行を大きな表に追加
  mainTableData.push(row);

  return mainTableData;
}

function createTable(largeTable) {
  const table = document.getElementById("largeTable");

  // 各行を生成
  largeTable.forEach((rowData) => {
    const row = document.createElement("tr");

    rowData.forEach((cellData) => {
      const cell = document.createElement("td");

      if (Array.isArray(cellData)) {
        // 小さな表を作成
        const nestedTable = document.createElement("table");
        nestedTable.border = "1";
        cellData.forEach((nestedRowData) => {
          const nestedRow = document.createElement("tr");
          nestedRowData.forEach((nestedCellData) => {
            const nestedCell = document.createElement("td");
            nestedCell.innerHTML = nestedCellData; // HTMLを解釈して表示
            nestedRow.appendChild(nestedCell);
          });
          nestedTable.appendChild(nestedRow);
        });
        cell.appendChild(nestedTable);
      } else {
        // 1行目や通常のセルの内容
        // 文字列であれば改行を反映
        if (typeof cellData === "string") {
          cell.innerHTML = cellData.replace(/\n/g, "<br>"); // 改行文字を <br> タグに置き換え
        } else {
          cell.textContent = cellData; // 文字列でない場合はそのまま表示
        }

        // 素数のセルに色を付ける
        if (isPrime(cellData)) {
          cell.style.backgroundColor = "#f2b5d4"; // 素数のセルにピンク色を適用
        }
      }

      row.appendChild(cell);
    });

    table.appendChild(row);
  });
}

// 関数呼び出し
let tableData = generateTableData();
createTable(tableData);
