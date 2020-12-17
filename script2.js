/**
 * @param {*} str Decodes a string from base64 to unicode.
 */

const b64DecodeUnicode = str => {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

const generateOptions = (list, ParentNode, plus, type) => {
    for (let i = 0; i < list.length; i++) {
        const option = document.createElement('option')
        option.textContent = list[i]
        if (type === 'number') {
            option.value = i + plus
        } else if (type === 'str') {
            option.value = list[i]
        }
        if (list[i] === 'boolean') {
            option.textContent = 'True / False'
        }
        ParentNode.appendChild(option)
    }
}
const generateLabel = (parentNode, arr, type) => {
    if (type === 'multiple') {
        let grid = ['a', 'b', 'c', 'd']
        for (let i = 1; i < 5; i++) {
            const label = document.createElement('label')
            label.setAttribute('for', 'answer' + i)
            label.id = 'label' + i
            // label.setAttribute("grid-area", grid[i])
            label.style.gridArea = grid[i-1]
            const radio = document.createElement('input')
            radio.type = 'radio'
            radio.name = 'answers'
            radio.className = 'input'
            radio.id = 'answer' + i
            parentNode.appendChild(radio)
            parentNode.appendChild(label)
            arr.push({
                label,
                radio
            })
        }
    } else if (type === 'boolean') {
        let grid = ['a', 'b']
        for (let i = 1; i < 3; i++) {
            const label = document.createElement('label')
            label.setAttribute('for', 'answer' + i)
            label.id = 'label' + i
            // label.setAttribute("grid-area", grid[i])
            // label.style.fontSize = '4rem'
            // label.style.padding = '1em'
            // label.style.textAlign = 'center'
            label.style.gridArea = grid[i-1]
            const radio = document.createElement('input')
            radio.type = 'radio'
            radio.name = 'answers'
            radio.className = 'input'
            radio.id = 'answer' + i
            parentNode.appendChild(radio)
            parentNode.appendChild(label)
            arr.push({
                label,
                radio
            })
        }
    }
    return arr
}
const generateQuestion = (response, question, choices, questions, x) => {
    question.textContent = b64DecodeUnicode(response.results[x].question)
    for (let i = 0; i < choices.length; i++) {
        questions[i].label.textContent = choices[i]
        questions[i].radio.value = choices[i]
    }
    questions[0].radio.checked = true
}

/* ---- Page welcome ---- */
const main = document.createElement('main')
const welcomeDiv = document.createElement('div')
welcomeDiv.id = 'welcome'
const welcomeH1 = document.createElement('h1')
welcomeH1.textContent = 'Welcome to the trivia game !'
welcomeDiv.appendChild(welcomeH1)
main.appendChild(welcomeDiv)
document.body.appendChild(main)
setTimeout(() => {
    main.innerHTML = ''
    play()
}, 4000)

/* ---- Page choix options --- */
function play() {
    main.innerHTML = ''
    const categoryList = ['General Knowledge', 'Entertainment: Books', 'Entertainment: Film', 'Entertainment: Music', 'Entertainment: Musicals & Theatres', 'Entertainment: Television', 'Entertainment: Video Games', 'Entertainment: Board Games', 'Science & Nature', 'Science: Computers', 'Science: Mathematics', 'Mythology', 'Sports', 'Geography', 'History', 'Politics', 'Art', 'Celebrities', 'Animals', 'Vehicles', 'Entertainment: Comics', 'Science: Gadgets', 'Entertainment: Japanese Anime & Manga', 'Entertainment: Cartoon & Animations']
    const difficultyList = ['easy', 'medium', 'hard']
    const numList = [5, 10, 15, 20]
    const typeList = ['multiple', 'boolean']
    let step = 'category'
    const choice = document.createElement('div')
    choice.id = 'category'
    const choiceLabel = document.createElement('label')
    choiceLabel.setAttribute('for', 'categoryChoice')
    choiceLabel.textContent = 'Choose a category :'
    const choiceSelect = document.createElement('select')
    choiceSelect.id = 'categoryChoice'
    generateOptions(categoryList, choiceSelect, 9, 'number')
    const button = document.createElement('button')
    button.id = 'send'
    button.textContent = 'Enter'
    choice.appendChild(choiceLabel)
    choice.appendChild(choiceSelect)
    choice.appendChild(button)
    main.appendChild(choice)
    let category
    let difficulty
    let number
    let type
    let question
    button.addEventListener('click', () => {
        if (step === 'category') {
            category = choiceSelect.value
            choiceSelect.innerHTML = ''
            choiceLabel.textContent = 'Choose a difficulty :'
            generateOptions(difficultyList, choiceSelect, 0, 'str')
            step = 'difficulty'
        } else if (step === 'difficulty') {
            difficulty = choiceSelect.value
            choiceSelect.innerHTML = ''
            choiceLabel.textContent = 'How many questions do you want ?'
            generateOptions(numList, choiceSelect, 0, 'str')
            step = 'num'
        } else if (step === 'num') {
            number = choiceSelect.value
            choiceSelect.innerHTML = ''
            choiceLabel.textContent = 'What kind of quizz do you want ?'
            generateOptions(typeList, choiceSelect, 0, 'str')
            button.textContent = 'GO !'
            step = 'type'
        } else if (step === 'type') {
            type = choiceSelect.value
            choice.innerHTML = ''
            choice.id = 'quizz'
            const quizzH2 = document.createElement('h2')
            const divPropositions = document.createElement('div')
            if (type === 'multiple') {
                divPropositions.id = 'propositions'
            } else if (type === 'boolean') {
                divPropositions.id = 'boolean'
            }
            const valid = document.createElement('button')
            valid.id = 'valid'
            valid.textContent = 'Validate your answer'
            choice.appendChild(quizzH2)
            choice.appendChild(divPropositions)
            choice.appendChild(valid)
            questions = []
            generateLabel(divPropositions, questions, type)
            const inputs = document.querySelectorAll('input')
            fetch('https://opentdb.com/api.php?amount=' + number + '&category=' + category + '&difficulty=' + difficulty + '&type=' + type + '&encode=base64')
            .then(response => response.json())
            .then(response => {
                let i = 0
                let score = 0
                let choices = []
                choices.push(b64DecodeUnicode(response.results[i].correct_answer))
                for (let elem of response.results[i].incorrect_answers) {
                    choices.push(b64DecodeUnicode(elem))
                }
                choices = shuffleArray(choices)
                generateQuestion(response, quizzH2, choices, questions, i)
                valid.addEventListener('click', () => {
                    valid.disabled = true
                    for (let elem of inputs) {
                        if (elem.checked) {
                            if (elem.value == b64DecodeUnicode(response.results[i].correct_answer)) {
                                score++
                                const right = document.createElement('div')
                                right.id = 'right'
                                const h3 = document.createElement('h3')
                                h3.textContent = 'WELL DONE !!!'
                                const p = document.createElement('p')
                                p.innerHTML = 'Correct answer !<br>You\'ve got ' + score + ' points !'
                                const next = document.createElement('button')
                                next.id = 'next'
                                next.textContent = 'Next question'
                                right.appendChild(h3)
                                right.appendChild(p)
                                right.appendChild(next)
                                main.appendChild(right)
                                next.addEventListener('click', () => {
                                    main.removeChild(right)
                                    i++
                                    if (i >= number) {
                                        choice.innerHTML = ''
                                        choice.id = 'result'
                                        const h1 = document.createElement('h1')
                                        h1.textContent = 'The game is over! You have ' + score + ' out of ' + number + ' points!'
                                        const btnPlayAgain = document.createElement('button')
                                        btnPlayAgain.textContent = 'Want to play again ?'
                                        choice.appendChild(h1)
                                        choice.appendChild(btnPlayAgain)
                                        btnPlayAgain.addEventListener('click', play)
                                    } else {
                                        // for (let elem of inputs) {
                                        //     elem.disabled = false
                                        // }
                                        choices = []
                                        choices.push(b64DecodeUnicode(response.results[i].correct_answer))
                                        for (let elem of response.results[i].incorrect_answers) {
                                            choices.push(b64DecodeUnicode(elem))
                                        }
                                        choices = shuffleArray(choices)
                                        generateQuestion(response, quizzH2, choices, questions, i)
                                        valid.disabled = false
                                    }
                                })
                            } else {
                                const wrong = document.createElement('div')
                                wrong.id = 'wrong'
                                const h3 = document.createElement('h3')
                                h3.textContent = 'WRONG !!!'
                                const p = document.createElement('p')
                                p.innerHTML = 'The correct answer was ' + b64DecodeUnicode(response.results[i].correct_answer) + ' !<br>You\'ve got ' + score + ' points !'
                                const next = document.createElement('button')
                                next.id = 'next'
                                next.textContent = 'Next question'
                                wrong.appendChild(h3)
                                wrong.appendChild(p)
                                wrong.appendChild(next)
                                main.appendChild(wrong)
                                next.addEventListener('click', () => {
                                    main.removeChild(wrong)
                                    i++
                                    if (i >= number) {
                                        choice.innerHTML = ''
                                        choice.id = 'result'
                                        const h1 = document.createElement('h1')
                                        h1.innerHTML = 'The game is over!<span>You have ' + score + ' out of ' + number + ' points!</span>'
                                        const btnPlayAgain = document.createElement('button')
                                        btnPlayAgain.textContent = 'Want to play again ?'
                                        choice.appendChild(h1)
                                        choice.appendChild(btnPlayAgain)
                                        btnPlayAgain.addEventListener('click', play)
                                    } else {
                                        // for (let elem of inputs) {
                                        //     elem.disabled = false
                                        // }
                                        choices = []
                                        choices.push(b64DecodeUnicode(response.results[i].correct_answer))
                                        for (let elem of response.results[i].incorrect_answers) {
                                            choices.push(b64DecodeUnicode(elem))
                                        }
                                        choices = shuffleArray(choices)
                                        generateQuestion(response, quizzH2, choices, questions, i)
                                        valid.disabled = false
                                    }
                                })
                            }
                        }
                        // elem.disabled = true
                    }
                    if (i >= number - 1) {
                        const next = document.querySelector('#next')
                        next.textContent = 'FINISH'
                    }
                })
            })
        }
    })
}