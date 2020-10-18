import GameModel from "./gamemodel";
import Observable, { Observer } from "../../../coregames/observable";
import IndicatorComponent from "./components/indicatorcomponent";
import SoundManager from "./soundmanager";
import { OperationAddition, OperationDivision, OperationMultiplication, OperationSubtraction } from "../../domain/config";
import AnswerComponent from "./components/answercomponent";
import PriceWindowComponent from "./components/pricewindowcomponent";
import QuestionComponent from "./components/questioncomponent";
import QuestionsComponent from "./components/questionscomponent";
import TimerComponent from "./components/timercomponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends cc.Component implements Observer {

    model: GameModel = null

    @property(cc.Label)
    lbScore: cc.Label = null

    @property(cc.Label)
    lbMessage: cc.Label = null


    @property(IndicatorComponent)
    indicator: IndicatorComponent = null

    @property(cc.Animation)
    animation: cc.Animation = null

    @property(SoundManager)
    soundManager: SoundManager = null

    @property(cc.Label)
    lbStage: cc.Label = null
    @property(cc.Label)
    lbTestBtn: cc.Label = null

    @property(cc.Label)
    lbItemValue: cc.Label = null

    @property(cc.Label)
    lbQuestion1: cc.Label = null

    @property(cc.Label)
    lbQuestion2: cc.Label = null

    @property(cc.Sprite)
    spIcon: cc.Sprite = null;


    @property(cc.Sprite)
    spBgAnswer: cc.Sprite = null;

    @property(cc.SpriteFrame)
    spBgAnswerLose: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spBgAnswerWin: cc.SpriteFrame = null;

    operands = {};

    @property(cc.SpriteFrame)
    icons: Array<cc.SpriteFrame> = [];

    @property(AnswerComponent)
    answers: Array<AnswerComponent> = [];

    @property(PriceWindowComponent)
    priceWindows: PriceWindowComponent[] = [];

    @property(QuestionComponent)
    question: QuestionComponent = null;

    @property(QuestionsComponent)
    questions: QuestionsComponent = null;

    //timer
    @property(TimerComponent)
    timer: TimerComponent = null

    currentAnswer: AnswerComponent = null;

    itemTypeToIcon = {};

    protected onLoad(): void {
        this.operands[OperationAddition] = "+";
        this.operands[OperationDivision] = "/";
        this.operands[OperationMultiplication] = "*";
        this.operands[OperationSubtraction] = "-";

        for (let i = 0; i < this.icons.length; i++) {
            this.itemTypeToIcon[GameModel.ItemTypes[i]] = this.icons[i];
        }

        this.answers.forEach((item) => {
            item.node.on("tap", this.onAnswerClick, this)
        });

    }

    onAnswerClick(answer) {
        this.node.emit("answer", answer);

        cc.log(answer.answer);
    }

    start() {

    }

    formatTime(duration: number) {
        if (duration < 0)
            return "00:00"

        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        // let h = (hours < 10) ? "0" + hours : hours;
        let m = (minutes < 10) ? "0" + minutes : minutes;
        let s = (seconds < 10) ? "0" + seconds : seconds;

        return m + ":" + s;
    }

    applyModel(model: GameModel) {
        this.model = model

        this.onObjectChanged(model)

        model.addObserver(this)
    }

    onNo() {
        this.node.emit("no")
    }

    onYes() {
        this.node.emit("yes")
    }

    onPause() {
        this.node.emit("pause")
    }

    onRestart() {
        this.node.emit("restart")
    }

    onHelp() {
        this.node.emit("help")
    }

    onItemClick(e, v) {
        cc.log(v);

        this.soundManager.playClick();

        if (v == "ok")
            this.node.emit("ok");
        else if (v == "delete")
            this.node.emit("number-delete");
        else
            this.node.emit("number-add", v);
    }

    onObjectChanged(model: GameModel) {

        this.lbScore.string = "Score: " + model.score.toString()

        let stageName = ["I", "II", "III", "IV", "V"]

        this.lbStage.string = "LEVEL " + stageName[model.currentStage]
        this.lbTestBtn.string = this.lbStage.string


        let question = model.currentQuestion;



        let answers = question.getListAnswers();


        for (let i = 0; i < this.answers.length; i++) {
            this.answers[i].node.active = false;
        }

        for (let i = 0; i < answers.length; i++) {
            this.answers[i].applyModel(answers[i]);
            this.answers[i].node.active = true;
        }


        this.questions.node.active = false;
        this.question.node.active = false;

        console.log('->', this.itemTypeToIcon)

        if (question.isGroup()) {
            let q1 = question.getData('q1');
            let q2 = question.getData('q2');

            this.questions.setQuestionQ1(q1.ItemValue, `${q1.Multiple}`, q1.SpendTerm, this.itemTypeToIcon[q1.ItemType]);
            this.questions.setQuestionQ2(q2.ItemValue, `${q2.Multiple}`, q2.SpendTerm, this.itemTypeToIcon[q2.ItemType])

            this.questions.node.active = true;

        } else {
            let q = question.getData()
            this.question.setQuestion(q.ItemValue, `${q.Multiple}`, q.SpendTerm, this.itemTypeToIcon[q.ItemType])

            this.question.node.active = true;
        }
        this.lbScore.string = `${model.score}`

        this.timer.play(model.maxGamePlayTime, model.gameFinishAt)
    }


    setAnswerBg(win?: boolean) {
        this.spBgAnswer.node.active = true;
        if (win) {
            this.spBgAnswer.spriteFrame = this.spBgAnswerWin;
        }
        else {
            this.spBgAnswer.spriteFrame = this.spBgAnswerLose;
        }


        this.scheduleOnce(() => {
            this.spBgAnswer.spriteFrame = null
            this.spBgAnswer.node.active = false
        }, .5)
    }

    protected lateUpdate(dt: number): void {
    }

    // update (dt) {}

    // for test
    testLevel() {
        if (this.model.currentStage === 4) {
            this.model.currentStage = 0;
        } else {
            this.model.currentStage += 1
        }

        this.model.reset();
        this.model.setChanged()
    }
}
