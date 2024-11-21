// 平衡三進法に変換する関数
function toBalancedTernary(n) {
  if (n === 0) return "0";
  let result = "";
  while (n !== 0) {
    let remainder = n % 3;
    n = Math.floor(n / 3);
    if (remainder === 2) {
      remainder = -1;
      n++;
    }
    result = (remainder === -1 ? "T" : remainder) + result;
  }
  return result;
}

// コラッツ予想と平衡三進法の表を生成
function generateTable() {
  const maxValue = parseInt(document.getElementById("maxValue").value, 10) || 1; // 最大値を取得
  const tableBody = document.querySelector("#collatzTable tbody");
  tableBody.innerHTML = ""; // 既存の表をクリア

  for (let startNumber = 1; startNumber <= maxValue; startNumber++) {
    let n = startNumber;
    const sequence = []; // コラッツ予想の計算結果を格納する配列

    // コラッツ予想の計算
    while (n !== 1) {
      const balancedTernary = toBalancedTernary(n);
      sequence.push({ value: n, ternary: balancedTernary });
      n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    }
    sequence.push({ value: 1, ternary: "1" }); // 最後の1を追加

    // 表の行を作成
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = startNumber; // 開始値

    // コラッツ予想の結果を整列して表示
    const sequenceCell = row.insertCell(1);
    sequence.forEach((item) => {
      const group = document.createElement("div");
      group.className = "number-group";
      group.innerHTML = `
                <span class="number">${item.value}</span>
                <span class="ternary">(${item.ternary})</span>
            `;
      sequenceCell.appendChild(group);
    });
  }
}
