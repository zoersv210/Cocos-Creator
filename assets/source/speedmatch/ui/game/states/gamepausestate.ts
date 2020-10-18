import GameState from "./gamestate";
import GamePlayState from "./gameplaystate";
import GameRememberState from "./gamerememberstate";
import HowToPlayPopUp from "../popups/howtoplaypopup";
import MenuPopUp from "../popups/menupopup";

export default class GamePauseState extends GameState{

    pauseStartTime:number
    restart:boolean = false

    async onStart(args: Array<any>) {
        await super.onStart(args);

        this.node.on("help",this.onHelp,this)

        this.pauseStartTime = new Date().getTime()

        let popUp = await this.controller.openPopUp(MenuPopUp);

        if(popUp.isRestart){
            this.model.gameFinishAt = 0
            this.model.currentQuestionIndex = 0;
        }

        if(this.model.gameFinishAt > 0){
            this.model.gameFinishAt += new Date().getTime() - this.pauseStartTime
            this.stateMachine.applyState(GamePlayState,[false])
        }else{
            this.stateMachine.applyState(GameRememberState,[this.restart])
        }

        this.model.setChanged();
    }


    async onHelp(){
        await this.controller.openPopUp(HowToPlayPopUp,this.model)
    }


    onReleaseResources() {
        super.onReleaseResources();

        this.node.off("help",this.onHelp,this)


    }
}
