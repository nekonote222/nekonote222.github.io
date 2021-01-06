function sanshin(pattern) {
  //console.log( $('#text-form').val())
  //let pattern = [1, 3, 9 ,27, 81, 243];
  //const pattern = [1, 2, 3, 4, 5, 6, 7, 8, 9 ,10, 11 ,12 ,13];
  let start = [0];
  let total = 0;
  total += pattern[0];
  for (let i = 1; i < pattern.length; i++) {
    total += Math.abs(pattern[i]);
    start.push(start[i - 1] + Math.abs(pattern[i - 1]));
  }

  //console.log(`patternは${pattern}`);
  //console.log(`patternは${start}`);

  let count;
  let count2;
  let n = total;

  let yuragi = [];

  for (let i = 0; i < pattern.length; i++) {
    let yuragi_sub = [];
    for (let j = 0; j < n; j++) {
      if (j < start[i]) {
        yuragi_sub.push(0);
      } else {
        switch (Math.floor((j - start[i] - 1) / pattern[i]) % 3) {
          case 0:
            yuragi_sub.push(pattern[i]);
            break;
          case 1:
            yuragi_sub.push(-1 * pattern[i]);
            break;
          case 2:
            yuragi_sub.push(0);
            break;
          default:
            console.log("計算に不正があります");
        }
      }
    }

    yuragi[i] = yuragi_sub;
    //  console.log("yuragi_subは");
    //  console.log(yuragi_sub);
    //  console.log("yuragiは");
    //  console.log(yuragi);
  }

  let ans = [];
  for (let i = 0; i < pattern.length + 4; i++) {
    ans[i] = [];
  }

  for (let i = 0; i < n; i++) {
    // 何番目の数かいれる
    ans[0][i] = i + 1;

    // ゆらぎの情報をいれる
    for (let j = 1; j < pattern.length + 1; j++) {
      ans[j][i] = yuragi[j - 1][i];
    }

    // 何番目の数かいれる
    ans[pattern.length + 1][i] = i + 1;

    // 答えの情報を計算していれる
    ans[pattern.length + 2][i] = 0;
    for (let k = 0; k < pattern.length; k++) {
      ans[pattern.length + 2][i] = ans[pattern.length + 2][i] + yuragi[k][i];
    }

    // 答えの3進数の表記をいれる
    ans[pattern.length + 3][i] = ans[pattern.length + 2][i].toString(3);
  }

  return ans;
}
// 表の動的作成
function makeTable(data, tableId) {
  // 表の作成開始
  var rows = [];
  var table = document.createElement("table");

  // 表に2次元配列の要素を格納
  for (i = 0; i < data.length; i++) {
    rows.push(table.insertRow(-1)); // 行の追加
    for (j = 0; j < data[0].length; j++) {
      cell = rows[i].insertCell(-1);
      cell.appendChild(document.createTextNode(data[i][j]));
      // 背景色の設定
      if (i == 0) {
        cell.style.backgroundColor = "#bbb"; // ヘッダ行
      } else {
        cell.style.backgroundColor = "#ddd"; // ヘッダ行以外
      }
    }
  }
  // 指定したdiv要素に表を加える
  document.getElementById(tableId).appendChild(table);
}

$("#form").submit(function () {
  // 入力された値をスペース区切りで配列に入れる
  let inputText = $("#text-form").val().split(" ");
  let pattern = [];

  // 入力された値を文字列から数値に変える
  inputText.forEach((inputText) => {
    pattern.push(Number(inputText));
  });

  document.getElementById("table").append(inputText.join(" "));

  let ans = sanshin(pattern);
  // 表の動的作成
  makeTable(ans, "table");
  return false;
});

window.onload = function () {};
