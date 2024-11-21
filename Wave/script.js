function parsePatternInput(inputText) {
  const pattern = inputText.split(" ").map(Number);
  if (pattern.some(isNaN)) {
    throw new Error("入力が無効です。数値のみを入力してください。");
  }
  return pattern;
}

function computePatternStartIndicesAndTotalPatternLength(pattern) {
  let patternStartIndices = [0];
  let totalPatternLength = 0;

  for (let i = 0; i < pattern.length; i++) {
    totalPatternLength += Math.abs(pattern[i]);
    patternStartIndices.push(patternStartIndices[i] + 1);
  }

  return { patternStartIndices, totalPatternLength };
}

function computeCycleValues(pattern, patternStartIndices, totalPatternLength) {
  let allCycle = [];

  for (let i = 0; i < pattern.length; i++) {
    let cycle = [];
    const step = Math.abs(pattern[i]); // 絶対値を周期の最大値とする
    const sign = Math.sign(pattern[i]); // 元の符号を記録 (+1 または -1)

    for (let j = 0; j < totalPatternLength; j++) {
      if (j < patternStartIndices[i]) {
        // スタートインデックス以前は0
        cycle.push(0);
      } else if (pattern[i] === 0) {
        // pattern[i] が 0 の場合は常に 0
        cycle.push(0);
      } else {
        // 周期内の位置を計算
        const posInCycle = (j - patternStartIndices[i]) % (4 * step); // 1周期 = 4 * step
        let value;

        if (posInCycle < step) {
          // 前半 (正の減少)
          value = step - posInCycle;
        } else if (posInCycle < 2 * step) {
          // 次の段階 (負の増加)
          value = -(posInCycle - step);
        } else if (posInCycle < 3 * step) {
          // 負の減少
          value = -(3 * step - posInCycle);
        } else {
          // 正の増加
          value = posInCycle - 3 * step;
        }

        cycle.push(value * sign); // 元の符号を反映
      }
    }
    allCycle.push(cycle);
  }

  return allCycle;
}

function generateSanshinTable(pattern) {
  let { patternStartIndices, totalPatternLength } =
    computePatternStartIndicesAndTotalPatternLength(pattern);
  let allCycle = computeCycleValues(
    pattern,
    patternStartIndices,
    totalPatternLength
  );

  // 空白の説明を作成
  const descriptions = new Array(pattern.length + 2).fill(""); // 入力された数字の数分だけ空白

  // 他の説明を追加
  descriptions.push("和");

  let ans = new Array(pattern.length + 3).fill().map(() => []);
  for (let i = 0; i < totalPatternLength; i++) {
    ans[0][i] = i + 1; // 何番目の数かいれる
    for (let j = 0; j <= pattern.length - 1; j++) {
      ans[j + 1][i] = allCycle[j][i];
    }

    let sum = 0;

    for (let j = 0; j < pattern.length; j++) {
      sum += allCycle[j][i]; // 合計を計算
    }
    ans[pattern.length + 1][i] = i + 1; // 何番目の数かいれる
    ans[pattern.length + 2][i] = sum; // 答えをいれる
  }

  // 説明を最初の列に追加
  for (let i = 0; i < ans.length; i++) {
    ans[i].unshift(descriptions[i] || ""); // 説明を追加
  }

  return ans;
}

function renderTable(data, container) {
  const table = document.createElement("table");

  // ヘッダー行の作成
  const headerRow = table.insertRow();
  data[0].forEach((headerCell) => {
    const cell = headerRow.insertCell();
    cell.appendChild(document.createTextNode(headerCell));
    cell.classList.add("header"); // ヘッダースタイルを適用
  });

  // データ行の作成
  data.slice(1).forEach((row, index) => {
    const rowElement = table.insertRow();
    const realIndex = index + 1;

    // 下から6行目にヘッダースタイルを適用
    if (realIndex === data.length - 2) {
      rowElement.classList.add("header");
    }

    row.forEach((cellData) => {
      const cell = rowElement.insertCell();
      cell.appendChild(document.createTextNode(cellData));

      // ヘッダー行または下から2行目にheaderクラスを追加
      if (realIndex === data.length - 2) {
        cell.classList.add("header");
      } else {
        cell.classList.add("data");
      }
    });
  });

  container.appendChild(table);
}

// フォーム送信時の処理
function onFormSubmit(event) {
  event.preventDefault(); // フォーム送信のデフォルト動作を防ぐ

  const inputText = document.getElementById("text-form").value;
  const pattern = parsePatternInput(inputText); // 入力された値を数値の配列に変換

  // 入力とテーブルをセットにするコンテナを作成
  const resultContainer = document.createElement("div");
  resultContainer.classList.add("result-container");

  // 入力された値を表示する要素を作成
  const inputDisplay = document.createElement("div");
  inputDisplay.textContent = "入力された数列: " + inputText;
  inputDisplay.classList.add("input-display");

  resultContainer.appendChild(inputDisplay);

  // テーブルを生成して追加
  renderTable(generateSanshinTable(pattern), resultContainer);

  // 結果を全体のコンテナに追加
  document.getElementById("tableContainer").appendChild(resultContainer);
}

function scrollToLeft() {
  const container = document.getElementById("tableContainer");
  container.scrollLeft = 0;
}

function scrollToRight() {
  const container = document.getElementById("tableContainer");
  container.scrollLeft = container.scrollWidth;
}

// ページが読み込まれた時の処理
window.onload = function () {
  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", onFormSubmit); // フォームのsubmitイベントを処理
  }
};
