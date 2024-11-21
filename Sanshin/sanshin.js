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
    patternStartIndices.push(patternStartIndices[i] + Math.abs(pattern[i]));
  }

  return { patternStartIndices, totalPatternLength };
}

function computeCycleValues(pattern, patternStartIndices, totalPatternLength) {
  let allCycle = [];

  for (let i = 0; i < pattern.length; i++) {
    let cycle = [];
    const step = Math.abs(pattern[i]); // パターンの長さ

    for (let j = 0; j < totalPatternLength; j++) {
      if (j < patternStartIndices[i] || pattern[i] === 0) {
        cycle.push(0);
        continue;
      }
      let patternStage = Math.floor((j - patternStartIndices[i]) / step) % 3;

      switch (patternStage) {
        case 0:
          cycle.push(pattern[i]);
          break;
        case 1:
          cycle.push(-pattern[i]);
          break;
        case 2:
          cycle.push(0);
          break;
        default:
          console.log("計算に不正があります");
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
  descriptions.push("三進表記");
  descriptions.push("平衡三進法表記");
  descriptions.push("+と-");
  descriptions.push("一つ前との差");

  let ans = new Array(pattern.length + 7).fill().map(() => []);
  for (let i = 0; i < totalPatternLength; i++) {
    ans[0][i] = i + 1; // 何番目の数かいれる
    for (let j = 0; j <= pattern.length - 1; j++) {
      ans[j + 1][i] = allCycle[j][i];
    }

    let sum = 0;
    let signSum = 0;

    for (let j = 0; j < pattern.length; j++) {
      sum += allCycle[j][i]; // 合計を計算
      signSum += allCycle[j][i] > 0 ? 1 : allCycle[j][i] < 0 ? -1 : 0; // 符号の計算
    }
    ans[pattern.length + 1][i] = i + 1; // 何番目の数かいれる
    ans[pattern.length + 2][i] = sum; // 答えをいれる
    ans[pattern.length + 3][i] = ans[pattern.length + 2][i].toString(3); // 答えの3進数の表記をいれる
    ans[pattern.length + 4][i] = toBalancedTernary(ans[pattern.length + 2][i]); // 平衡三進法
    ans[pattern.length + 5][i] = signSum;
    ans[pattern.length + 6][i] =
      i === 0 ? 0 : ans[pattern.length + 2][i] - ans[pattern.length + 2][i - 1]; // 前の答えとの差
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
    if (realIndex === data.length - 6) {
      rowElement.classList.add("header");
    }

    row.forEach((cellData) => {
      const cell = rowElement.insertCell();
      cell.appendChild(document.createTextNode(cellData));

      // ヘッダー行または下から6行目にheaderクラスを追加
      if (realIndex === data.length - 6) {
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
