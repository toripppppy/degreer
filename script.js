const dataInput = document.getElementById('data-input');
const dataOutput = document.getElementById('data-output');
const keyInput = document.getElementById('key-input');

dataInput.addEventListener("input", updateOutput);
keyInput.addEventListener("input", updateOutput);

// ディグリーを取得
function getDegree(note) {
    if (!/[A-G](#|b|)/.test(note)) return;

    const degreeDict = {
        'C': 0,
        'D': 1,
        'E': 2,
        'F': 2.5,
        'G': 3.5,
        'A': 4.5,
        'B': 5.5,
    };

    // #,b付きの処理
    let s = 0
    if (note.match(/[A-G]#/)) {
        note = note.replace('#', '');
        s = 0.5;

    } else if (note.match(/[A-G]b/)) {
        note = note.replace('b', '');
        s = -0.5;
    };

    return (degreeDict[note] + s) % 6;
};

// 対応するディグリー表記を取得
function getDegreeName(note) {
    const degreeDict = {
        0: 'Ⅰ',
        0.5: '#Ⅰ',
        1: 'Ⅱ',
        1.5: 'bⅢ',
        2: 'Ⅲ',
        2.5: 'Ⅳ',
        3: '#Ⅳ',
        3.5: 'Ⅴ',
        4: 'bⅥ',
        4.5: 'Ⅵ',
        5: 'bⅦ',
        5.5: 'Ⅶ',
    };

    // キーを取得
    let key = keyInput.value.replace(/\(.*\)/, '');

    // ディグリーを取得
    const diff = getDegree(key);
    let degree = (getDegree(note) - diff);

    // オクターブ超えの対応
    if (0 > degree || degree > 5.5) {
        degree = (degree + 6) % 6
    };

    return degreeDict[degree];
};

// 整形して出力を更新
function updateOutput() {
    // 改行・表記揺れに対応
    let dataText = dataInput.innerText.trim().replace(/\n/g, '<br>').replace('♭', 'b').replace("＃", "#");
    
    const matcheList = dataText.match(/[A-G](#|b|)/g);

    // マッチしない場合は無視
    if (matcheList != null) {
        // 整形
        for (const note of matcheList) {
            dataText = dataText.replace(note, `<span class="root">${getDegreeName(note)}</span>`);
        };
        // オンコードの書き換え
        dataText = dataText.replaceAll('/<span class="root">', '/<span class="on">');
    }

    dataOutput.innerHTML = dataText;
};