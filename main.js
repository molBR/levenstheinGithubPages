function levensthein(str1, str2) {

    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
   return track[str2.length][str1.length];
}


function percentageValue(levenstheinValue, keywordLength){
    const percentage = 100 - ((levenstheinValue/keywordLength)*100)
    return percentage
}

function percentageCompare(p1, p2) {
    if(p1>=p2) return true
    return false
}



async function levenstheinUseCase(buttonsWithKeywords, keyWordComparing, percentage) {

    
    const levenstheinButtonArray = []
    buttonsWithKeywords.map(bwk => {

        const resultButton = {
            lowestDistance: 1000,
            isValid:false,
            keyWords: []

        }

        bwk.keywords.map(keyword => {

            const levenstheinValue = levensthein(keyword, keyWordComparing)
            const percentageKeyword = percentageValue(levenstheinValue,keyword.length)
            const flag = percentageCompare(percentageKeyword, percentage)
            resultButton.keyWords.push({
                name: keyword,
                levenstheinValue,
                percentageKeyword,
                isValid: flag
            })
            if(levenstheinValue < resultButton.lowestDistance){
                resultButton.lowestDistance = levenstheinValue
            }
            if(flag){
                resultButton.isValid = true
            }
        })
        levenstheinButtonArray.push(resultButton)
    })
    return Promise.resolve(levenstheinButtonArray)
}

function handleButtons(buttons) {
    const bufferButtons = []
    const bufferWords = []
    const bufferArrayOfWords = []
    const bufferArrayOfButtons = []
    for(i=0;i<buttons.length;i++){
        bufferChar = buttons[i]
        if(bufferChar == "["){
            if(bufferButtons.length >= 1) return Promise.reject()
            else bufferButtons.push(bufferChar)
        }else if(bufferChar == "]"){
            if(bufferButtons.length != 1) return Promise.reject()
            else {
                bufferArrayOfWords.push(bufferWords.join(""))
                bufferWords.length = 0  
                bufferArrayOfButtons.push({
                    keywords: [...bufferArrayOfWords]
                })
                bufferArrayOfWords.length = 0
                bufferButtons.pop()
            }

        }
        else if(bufferChar == ","){
            if(bufferWords.length == 0) return Promise.reject()
            else {
                bufferArrayOfWords.push(bufferWords.join(""))
                bufferWords.length = 0
            }
        }
        else {
            bufferWords.push(bufferChar)
        }
    }
    return Promise.resolve(bufferArrayOfButtons)
}



async function filterPercentage (arrayLevenstheinButtons) {

    return arrayLevenstheinButtons.filter(alb => alb.isValid)
}

async function outputHandler(filteredButtons) {
    document.getElementById('result').innerHTML = ""
    document.getElementById('result').innerHTML += "<h2>RESULT</h2>"
    let num = 1
    filteredButtons.map(fb => {
        document.getElementById('result').innerHTML+= `<b>BUTTON #${num}:</b>`
        fb.keyWords.map(kw => {
            if(kw.isValid){
                document.getElementById('result').innerHTML+= `<p style="color: blue">${kw.name}</p>`
            }else{
                document.getElementById('result').innerHTML+= `<p>${kw.name}</p>`
            }
        })  
        document.getElementById('result').innerHTML+= "<br>"
        num++
    })

}

async function test() {
    const percentage = document.getElementById("percentage").value
    const term = document.getElementById("searchTerm").value
    const keywords = document.getElementById("searchButtons").value
    
    const buttonsWithKeywords = await handleButtons(keywords)
    const result = await levenstheinUseCase(buttonsWithKeywords, term, percentage)
    console.log(result)
    const filteredResult = await filterPercentage(result)
    outputHandler(filteredResult)
    
    
}