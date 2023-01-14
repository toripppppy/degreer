const dataInput = document.getElementById('data-input')
const dataOutput = document.getElementById('data-output')
const keyInput = document.getElementById('key-input')
const button = document.getElementById('toggle-btn')

let CmajMode = false



$(".toggle").on("click", function () {
    $(".toggle").toggleClass("checked");
    if (!$('input[name="check"]').prop("checked")) {
        spanRoot(true)
        $(".toggle input").prop("checked", true);
    } else {
        spanRoot(false)
        $(".toggle input").prop("checked", false);
    }
});

// データ保存用
let beforeDataText = dataInput.innerText

// ディグリーを取得
function getDegree(note) {
    if (!/[A-G](#|b|)/.test(note)) return

    const degreeDict = {
        'C': 0,
        'D': 1,
        'E': 2,
        'F': 2.5,
        'G': 3.5,
        'A': 4.5,
        'B': 5.5,
    }

    // #,b付きの処理
    let s = 0
    if (note.match(/[A-G]#/)) {
        note = note.replace('#', '')
        s = 0.5

    } else if (note.match(/[A-G]b/)) {
        note = note.replace('b', '')
        s = -0.5
    }

    return (degreeDict[note] + s) % 6
}

// Cメジャーに変換
function toCmaj(dataText) {
    const CmajDict = {
        'Ⅰ': 'C',
        '#Ⅰ': 'C#',
        'Ⅱ': 'D',
        'bⅢ': 'Db',
        'Ⅲ': 'E',
        'Ⅳ': 'F',
        '#Ⅳ': 'F#',
        'Ⅴ': 'G',
        'bⅥ': 'Ab',
        'Ⅵ': 'A',
        'bⅦ': 'Bb',
        'Ⅶ': 'B',
    }

    const matcheList = dataText.match(/(#|b|)[ⅠⅡⅢⅣⅤⅥⅦ]/g)

    if (matcheList != null) {
        for (let note of matcheList) {
            dataText = dataText.replace(note, CmajDict[note])
        }
    }

    return dataText
}

// 対応するディグリー表記を取得
function getDegreeName(note) {
    let key = keyInput.value.replace(/\(.*\)/, '')

    const diff = getDegree(key)
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
    }

    let degree = (getDegree(note) - diff)

    if (0 > degree || degree > 5.5) {
        degree = (degree + 6) % 6
    }

    return degreeDict[degree]
}

// 整形してアウトプット
function spanRoot(CmajMode) {
    // 改行に対応・フラットの表記を統一
    let dataText = dataInput.innerText.trim().replace(/\n/g, '<br>').replace('♭', 'b')
    
    const matcheList = dataText.match(/[A-G](#|b|)/g)

    if (matcheList != null) {
        for (let note of matcheList) {
            dataText = dataText.replace(note, `<span class="root">${getDegreeName(note)}</span>`)
            // オンコードの書き換え
            const onChordRegexp = new RegExp('/<span class="root">')
            dataText = dataText.replace(onChordRegexp, '/<span class="on">')
        }
    }
    if (CmajMode) {
        dataOutput.innerHTML = toCmaj(dataText)
    } else {
        dataOutput.innerHTML = dataText
    }
    
}

function update() {
    // テキストが変更された時のみ更新
    if (dataInput.innerText != beforeDataText) {
        spanRoot($('input[name="check"]').prop("checked"))
    }
    beforeDataText = dataInput.innerText
}

function onChange() {
    spanRoot($('input[name="check"]').prop("checked"))
}

setInterval(update, 10)