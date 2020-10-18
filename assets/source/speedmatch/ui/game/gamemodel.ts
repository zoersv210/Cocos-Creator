import Observable from "../../../coregames/observable";
import Config from "../../domain/config";

class Experience {
    negative: number = 1
    positive: number = 1

    get exp(): number {
        return this.positive / this.negative
    }

    constructor(negative: number = 1, positive: number = 1) {
        this.negative = negative
        this.positive = positive
    }

}


interface IQuestionOpts {
    SetName: string
    Level: number
    ItemType: string
    ItemValue: string
    Multiple: number
    SpendTerm: string
    SpendMultiple: number
    CostTerm: string
    Answer: string
    IncorrectAnswer1: string
    IncorrectAnswer2: string
    IncorrectAnswer3: string
}

interface IQuestion {
    getData(...rest): IQuestionOpts
    getListAnswers(): string[]
    isGroup(): boolean;
    getAnswers(): string[]
    Answer: string

}

export class Question implements IQuestion {
    setName = ''
    level: number
    itemType = ''
    itemValue = ''
    multiple = 1
    spendTerm = ""
    spendMultiple = 12
    costTerm = ''
    answer = ''
    incorrectAnswer1 = ''
    incorrectAnswer2 = ''
    incorrectAnswer3 = ''


    stage = 0

    private _answers: string[] = []


    constructor(opts: IQuestionOpts, stage: number) {
        this.setName = opts.SetName;
        this.level = opts.Level;
        this.itemType = opts.ItemType;
        this.itemValue = opts.ItemValue
        this.multiple = opts.Multiple;
        this.spendTerm = opts.SpendTerm;
        this.spendMultiple = opts.SpendMultiple;
        this.costTerm = opts.CostTerm
        this.answer = opts.Answer
        this.incorrectAnswer1 = opts.IncorrectAnswer1
        this.incorrectAnswer2 = opts.IncorrectAnswer2
        this.incorrectAnswer3 = opts.IncorrectAnswer3

        this.stage = stage

    }

    get Answer() {
        return this.answer
    }

    getData() {
        return {
            SetName: this.setName,
            Level: this.level,
            ItemType: this.itemType,
            ItemValue: this.itemValue,
            Multiple: this.multiple,
            SpendTerm: this.spendTerm,
            SpendMultiple: this.spendMultiple,
            CostTerm: this.costTerm,
            Answer: this.answer,
            IncorrectAnswer1: this.incorrectAnswer1,
            IncorrectAnswer2: this.incorrectAnswer2,
            IncorrectAnswer3: this.incorrectAnswer3,
        }
    }

    getListAnswers() {
        if (this._answers.length > 0) {
            return this._answers
        }

        let answers = this.getAnswers();

        if (this.stage === 0) {
            answers.splice(GameModel.randomInt(1, answers.length), 1)
        }

        let n = GameModel.randomInt(0, answers.length);

        [answers[n], answers[0]] = [answers[0], answers[n]]

        this._answers = answers
        return this._answers
    }


    getAnswers() {
        return [this.answer, this.incorrectAnswer1, this.incorrectAnswer2, this.incorrectAnswer3];
    }

    isGroup() {
        return false
    }
}

export class QuestionGroup implements IQuestion {

    q1: Question
    q2: Question
    stage: number

    private _answer: number = 0;

    private _answers: string[] = []

    constructor(q1: Question, q2: Question, stage: number) {
        this.q1 = q1;
        this.q2 = q2
        this.stage = stage
    }

    get Answer() {
        return `$${this._answer}`
    }

    getData(val: 'q1' | 'q2') {
        return val === 'q1' ? this.q1.getData() : this.q2.getData()
    }

    getListAnswers() {
        if (this._answers.length > 0) {
            return this._answers
        }

        let temp = [...this.q1.getAnswers().slice(1), ...this.q2.getAnswers().slice(1)]
        let answers: string[] = []

        for (let i = 0, len = temp.length / 2; i < len; i++) {
            let n = temp[i] ? this._paresePrice(temp[i]) : 0;
            let m = temp[i + 3] ? this._paresePrice(temp[i + 3]) : 0;

            answers.push(`$${n + m}`)
        }

        let m = 0;

        if (this.stage === 0) {
            m = 1
        }

        while (m) {
            answers.splice(GameModel.randomInt(0, answers.length), 1)
            m--;
        }

        this._answer = this._paresePrice(this.q1.Answer) + this._paresePrice(this.q2.Answer);

        answers.push(`$${this._answer}`)

        let n = GameModel.randomInt(0, answers.length);
        [answers[n], answers[answers.length - 1]] = [answers[answers.length - 1], answers[n]]

        this._answers = answers
        return answers
    }

    isGroup() {
        return true
    }


    getAnswers() {
        return [...this.q1.getAnswers(), ...this.q2.getAnswers()]
    }

    private _paresePrice(n: string) {
        n = n.replace(' ', '');
        if ('$' === n[0]) {
            n = n.slice(1);
        }
        return parseFloat(n)
    }

}

export default class GameModel extends Observable {
    static ItemTypes = ["Coffee",
        "Shake/Smoothie",
        "Gas",
        "Gym Session",
        "Haircut",
        "Slice of Cake",
        "Milk",
        "Flight",
        "T-Shirt",
        'Hotel',
        'Sneaker',
        'Takeaway Meal'];

    readonly percentTwoEquations = [.1, .2, .3, .4, .5]

    value: string = "";
    score: number = 0
    gameTimeForBonus = 0;
    correctCounter: number = 0;
    gameFinishAt: number = 0
    maxGamePlayTime: number = 60
    message: string = ""
    countDown: number = 0
    correctResult: number = 0;
    scoreToStage: Array<number> = [1000, 10000, 15000, 20000]
    stageMatch: Array<boolean> = [true, true, false, false]
    stagePreviousCardsCount: Array<number> = [1, 2, 1, 2]

    stageExperience: Array<Experience> = []

    currentStage: number = 0
    sequenceCorrectNumber: number = 0
    scoreMultiplier: number = 1
    levels = [];
    currentQuestionIndex = 0;
    isWin: boolean = false;
    wrongCounter: number = 0;
    streaks: number[] = []


    calculateStage(): number {
        let stage: number = 0

        for (let i = 0; i < this.scoreToStage.length; i++) {
            if (this.score > this.scoreToStage[i])
                stage = i
            else
                break
        }

        return stage;
    }


    getDifficultyBonus(level: number) {
        return level * 7250;
    }

    getTimeBouns(leftTime: number) {
        const bonus = 5000;
        const minLeftTime = 20;
        const bonusReduceBy = 100;

        if (leftTime <= 0) {
            return 0;
        }

        if (minLeftTime >= leftTime) {
            return bonus
        }

        return Math.floor(Math.max(0, bonus - bonusReduceBy * (leftTime - minLeftTime)))
    }

    getStreakBonus(n: number) {
        const bonus = 150;
        const minStreak = 3;
        const bonusIncreaseBy = 50;

        if (n < minStreak) {
            return 0;
        }

        return Math.floor(bonus + bonusIncreaseBy * (n - minStreak));
    }

    getTotalBonus() {
        return this.score + this.getDifficultyBonus(this.currentStage + 1) + this.getStreakBonus(this.getMaximumStreak()) + this.getTimeBouns(this.gameTimeForBonus)
    }

    getMaximumStreak() {
        return Math.max(0, ...this.streaks)
    }

    addStreak(n: number) {
        if (n < 1) {
            return;
        }

        this.streaks.push(n)
    }

    reset() {
        console.log('[GAME MODAL] rest')

        this.stageExperience = [];
        this.gameTimeForBonus = 0;
        this.gameFinishAt = new Date().getTime() + this.maxGamePlayTime * 1000;
        this.score = 0;
        this.correctCounter = 0;
        this.levels = [];
        this.isWin = false;
        this.wrongCounter = 0;
        this.currentQuestionIndex = 0;
        this.sequenceCorrectNumber = 0
        this.streaks = [];

        let config = new Config();

        for (let levelNumber = 1; levelNumber <= 5; levelNumber++) {
            let level = {};

            for (let i = 0; i < config.items.length; i++) {
                let item = config.items[i];

                if (item.Level <= levelNumber) {
                    let questions = level[item.ItemType];

                    if (!questions) {
                        questions = [];
                        level[item.ItemType] = questions;
                    }

                    questions.push(item);
                }
            }

            this.levels.push(level);
        }

        cc.log(this.levels)

        let levelIndex = 0;

        let categories = [...GameModel.ItemTypes]
        GameModel.shuffle(categories)

        categories.pop();
        categories.pop()

        this.levels.forEach((level) => {

            level.questions = [];
            levelIndex++;

            categories.forEach((itemType) => {
                let items = level[itemType];

                if (items) {
                    GameModel.shuffle(items);
                    level.questions.push(new Question(level[itemType].pop(), this.currentStage));
                } else
                    cc.warn("Item type:" + itemType + " not found, level:" + levelIndex);

            })



            GameModel.shuffle(level.questions);

            this.stageExperience.push(new Experience())
        });


        console.log(this.levels[this.currentStage])
        console.log(this.levels[this.currentStage].questions)

        this.levels[this.currentStage].questions = this.groupQuestions(this.levels[this.currentStage].questions)
        console.log('after grouped', this.levels[this.currentStage].questions)


    }

    groupQuestions(data: Question[]) {
        let r = this.percentTwoEquations[this.currentStage] || 0
        let m = Math.ceil(data.length * r);
        if (!m) {
            return [...data]
        }

        data = [...data]
        let temp: QuestionGroup[] = [];

        while (m) {
            let mm = GameModel.randomInt(0, data.length);

            let q1 = data[mm]

            data.splice(mm, 1)

            mm = GameModel.randomInt(0, data.length);

            let q2 = data[mm]

            // data.splice(mm, 1)

            temp.push(new QuestionGroup(q1, q2, this.currentStage))

            m--;
        }

        return [...data, ...temp];
    }

    get currentQuestion(): IQuestion {
        return this.levels[this.currentStage].questions[this.currentQuestionIndex];
    }

    get isGameOver(): boolean {
        return this.gameFinishAt < new Date().getTime()
    }

    randomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    constructor() {
        super();

        this.reset();
    }

    static randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    static shuffle(array: Array<unknown>) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

}
