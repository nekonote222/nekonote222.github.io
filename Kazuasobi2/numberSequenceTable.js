function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function generateMirroredSequence(numParts) {
  let sequence = [2, 4, 2]; // 初めに[2, 4, 2]

  let lastValue = 4; // 最初の計算に使う数
  for (let i = 0; i < numParts; i++) {
    // 新しい数を計算
    let newValue = lastValue * 3 - 2; // *3 - 2 の計算式
    sequence.push(newValue); // 新しい値を追加

    lastValue = newValue; // 新しい値を次の計算に使用

    // 数列の鏡のような部分を追加
    let mirrorPart = [...sequence].reverse();
    sequence = sequence.concat(mirrorPart.slice(1)); // 最初の要素は除外して追加
  }

  return sequence;
}

function generateSequenceTable(rows) {
  let table = document.getElementById("sequenceTable");
  let firstTerm = 1;
  let currentValue = 1;
  let increments = generateMirroredSequence(10);

  console.log(increments);

  for (let i = 0; i < rows; i++) {
    let row = document.createElement("tr");
    let numElements = Math.pow(2, i); // Number of elements in the row

    // Update currentValue for the first element of the row based on 3^(i-1)
    if (i > 0) {
      firstTerm += Math.pow(3, i - 1);
    }

    for (let j = 0; j < numElements; j++) {
      let cell = document.createElement("td");
      if (j == 0) {
        currentValue = firstTerm;
      }
      cell.textContent = currentValue;
      if (isPrime(currentValue)) {
        cell.classList.add("prime");
      }
      row.appendChild(cell);

      if (j >= 0 && j < increments.length) {
        currentValue += increments[j];
      }

      table.appendChild(row);
    }
  }
}
// Generate a table with a specified number of rows (e.g., 5)
generateSequenceTable(11);
