import GameState from "./gamestate"
import IndicatorComponent from "../components/indicatorcomponent"
import GameOverState from "./gameoverstate"
import GamePlayState from "./gameplaystate"

export default class GameProcessState extends GameState {

    async onStart(args: Array<any>) {
        super.onStart(args);

        let correct: boolean = args[0] == this.model.currentQuestion.Answer;

        console.log('correct ->', correct)

        let scorePerCorrectAnswer: number = 725

        this.view.currentAnswer.checkAnswer(this.model.currentQuestion.Answer);
        this.view.priceWindows.forEach((item) => item.setAnswer(correct))
        this.view.setAnswerBg(correct);

        if (correct) {
            this.model.correctCounter++
            this.model.sequenceCorrectNumber++


            //cc.log("Segment:" + segmentOfCorrectAnswer + ", correct count:" + this.model.correctCounter + ", score:" + scorePerCorrectAnswer)

            this.view.soundManager.playEffect(this.view.soundManager.clipOk)
            this.model.score += scorePerCorrectAnswer

        } else {

            this.model.wrongCounter++;

            // this.model.score = Math.max(0, this.model.score - scorePerCorrectAnswer);


            this.view.soundManager.playEffect(this.view.soundManager.clipNo)
            this.model.addStreak(this.model.sequenceCorrectNumber)
            this.model.sequenceCorrectNumber = 0
        }

        this.model.setChanged()

        let gameOver = this.model.gameFinishAt < new Date().getTime() || this.model.wrongCounter == 10;

        if (!gameOver) {
            if (this.model.currentQuestionIndex < this.model.levels[this.model.currentStage].questions.length - 1) {
                this.model.currentQuestionIndex++
            } else {


                gameOver = true;
                // if(this.model.currentStage < this.model.levels.length-1){
                //     this.model.currentStage++;
                //     this.model.gameFinishAt += 60 * 1000;
                // }else{
                //     this.model.isWin = true;

                //     gameOver = true;
                // }
            }
        }

        if (!gameOver) {
            this.scheduleOnce(this.onNext, 0.5);
        }
        else {
            this.model.isWin = !!this.model.score;
            this.model.addStreak(this.model.sequenceCorrectNumber)
            this.stateMachine.applyState(GameOverState)
        }
    }

    onNext() {
        this.stateMachine.applyState(GamePlayState, [true])
    }
}
