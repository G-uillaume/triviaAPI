const btnNext = document.querySelector('#next')
const btnValid = document.querySelector('#valid')
const quizz = document.querySelector('#quizz')
const question = document.querySelector('#question')
const categoryChoice = document.querySelector("#categoryChoice")
const difficultyChoice = document.querySelector('#difficultyChoice')
const numberChoice = document.querySelector('#numberChoice')
const categorySend = document.querySelector('#categorySend')
const difficultySend = document.querySelector('#difficultySend')
const numberSend = document.querySelector('#numberSend')
const go = document.querySelector('#go')
const welcome = document.querySelector("#welcome")
const cat = document.querySelector("#category")
const dif = document.querySelector("#difficulty")
const num = document.querySelector("#number")
const result = document.querySelector('#result')
const resultTitle = document.querySelector('#resultTitle')
const replay = document.querySelector('#replay')
const propositions = document.querySelector('#propositions')
let grid = ['a', 'b', 'c', 'd']
for (let i = 1; i < 5; i++) {
    const p = document.createElement('p')
    const label = document.createElement('label')
    label.setAttribute('for', 'answer' + i)
    label.id = 'label' + i
    label.setAttribute("grid-area", grid[i])
    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = 'answers'
    radio.className = 'input'
    radio.id = 'answer' + i
    propositions.appendChild(radio)
    propositions.appendChild(label)
}
const inputs = document.querySelectorAll('.input')

let category
let difficulty
let number
let url



categorySend.addEventListener('click', () => {
    category = categoryChoice.value
    cat.style.zIndex = '0'
})
difficultySend.addEventListener('click', () => {
    difficulty = difficultyChoice.value
    dif.style.zIndex = '0'
})
numberSend.addEventListener('click', () => {
    number = numberChoice.value
    num.style.zIndex = '0'

    fetch('https://opentdb.com/api.php?amount=' + number + '&category=' + category + '&difficulty=' + difficulty + '&type=multiple&encode=base64')
        .then(response => response.json())
        .then(response => {
            btnNext.disabled = true
            let choices = []
            choices.push(b64DecodeUnicode(response.results[0].correct_answer))
            for (let elem of response.results[0].incorrect_answers) {
                choices.push(b64DecodeUnicode(elem))
            }
            choices = shuffleArray(choices)

            question.textContent = b64DecodeUnicode(response.results[0].question)
            label1.textContent = choices[0]
            answer1.value = choices[0]
            answer1.checked = true
            label2.textContent = choices[1]
            answer2.value = choices[1]
            label3.textContent = choices[2]
            answer3.value = choices[2]
            label4.textContent = choices[3]
            answer4.value = choices[3]

            let i = 0
            let score = 0
            btnNext.addEventListener('click', () => {
                i++
                btnValid.disabled = false
                for (let input of inputs) {
                    input.disabled = false
                }
                choices = []
                choices.push(b64DecodeUnicode(response.results[i].correct_answer))
                for (let elem of response.results[i].incorrect_answers) {
                    choices.push(b64DecodeUnicode(elem))
                }
                choices = shuffleArray(choices)

                btnNext.textContent = 'Next question'
                question.textContent = b64DecodeUnicode(response.results[i].question)
                label1.textContent = choices[0]
                answer1.value = choices[0]
                label2.textContent = choices[1]
                answer2.value = choices[1]
                label3.textContent = choices[2]
                answer3.value = choices[2]
                label4.textContent = choices[3]
                answer4.value = choices[3]

                btnNext.disabled = true
            })
            btnValid.addEventListener('click', () => {
                for (let elem of inputs) {
                    if (elem.checked) {
                        if (elem.value == b64DecodeUnicode(response.results[i].correct_answer)) {
                            score++
                        } else {
                        }
                    }
                    elem.disabled = true
                }
                btnNext.disabled = false
                btnValid.disabled = true
                if (i >= response.results.length - 1) {
                    btnNext.disabled = true
                    quizz.style.zIndex = '0'
                    resultTitle.textContent = 'Congratulations ! You\'ve got ' + score + ' points !'
                }
            })
            replay.addEventListener('click', () => {
                document.location.reload()
            })
        })
        .catch(error => alert(error))
})

/**
 * @param {*} str Decodes a string from base64 to unicode.
 */

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}