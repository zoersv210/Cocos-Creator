import GameState from "./gamestate";
import GameProcessState from "./gameprocessstate";
import GameOverState from "./gameoverstate";
import GamePauseState from "./gamepausestate";

export default class GamePlayState extends GameState{

    async onStart(args: Array<any>) {
        super.onStart(args);

        let stageMessages = ["Does this symbol match the\nprevious symbol?",
            "Does this symbol match the symbol\non two cards previous?",
            "Does this symbol match the previous\nsymbol either by color or shape?",
            "Does this symbol match the symbol\neither by color or shape\non two cards previous?"]


        this.model.message = stageMessages[this.model.currentStage]

        this.node.on("number-delete",this.onNumberDelete,this)
        this.node.on("answer",this.onAnswer,this)
        this.node.on("ok",this.onOk,this)
        this.node.on("pause",this.onPause,this)

        this.model.value = "";
        this.model.setChanged();

        this.scheduleOnce(this.onGameOver, (this.model.gameFinishAt - new Date().getTime()) / 1000)
    }

    onAnswer(answer){
        this.view.currentAnswer = answer;

        this.stateMachine.applyState(GameProcessState,[answer.answer]);
    }

    onPause(){
        this.stateMachine.applyState(GamePauseState)
    }

    onGameOver(){
        this.stateMachine.applyState(GameOverState)
    }

    onNumberDelete(){
        if(this.model.value.length > 0){
            this.model.value = this.model.value.substring(0,this.model.value.length-1);
            this.model.setChanged();
        }
    }

    onNumberAdd(value){
        cc.log(value);
        this.model.value = this.model.value + "" +  value;
        this.model.setChanged();
    }

    onOk(){
        if(this.model.value.length > 0){
            let value = parseInt(this.model.value);

            this.stateMachine.applyState(GameProcessState,[value])
        }
    }

    onReleaseResources() {
        super.onReleaseResources();

        this.unscheduleAllCallbacks()

        this.node.off("number-delete",this.onNumberDelete,this)
        this.node.off("number-add",this.onNumberAdd,this)
        this.node.off("ok",this.onOk,this)
        this.node.off("pause",this.onPause,this)
        this.node.off("answer",this.onAnswer,this)

    }
}
