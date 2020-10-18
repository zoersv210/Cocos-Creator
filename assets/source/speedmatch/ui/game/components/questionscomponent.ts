import QuestionComponent from "./questioncomponent";
import { Question } from "../gamemodel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionsComponent extends cc.Component {

    @property(QuestionComponent)
    q1: QuestionComponent = null;
    @property(QuestionComponent)
    q2: QuestionComponent = null;


    setQuestionQ1(vl: string, q1: string, q2: string, sp: cc.SpriteFrame) {
        this.q1.setQuestion(vl, q1, q2, sp)
    }

    setQuestionQ2(vl: string, q1: string, q2: string, sp: cc.SpriteFrame) {
        this.q2.setQuestion(vl, q1, q2, sp)
    }
}
