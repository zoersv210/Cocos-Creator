import GameState from "./gamestate";
import GameOverPopUp from "../popups/gameoverpopup";
import GameRememberState from "./gamerememberstate";
import GamePlayState from "./gameplaystate";
import GameOverWinPopup from "../popups/gameoverwinpopup";

export default class GameOverState extends GameState{
    async onStart(args: Array<any>) {
        super.onStart(args);

        this.view.soundManager.playEffect(this.view.soundManager.clipGameOver)


        let left = this.model.gameFinishAt - Date.now();

        this.model.gameTimeForBonus = left > 0 ? Math.floor(this.model.maxGamePlayTime - left / 1000) : 0
        console.log('[LEFT]', this.model.maxGamePlayTime, left / 1000, this.model.gameTimeForBonus)
        this.model.gameFinishAt = 0
        this.model.message = ""
        this.model.setChanged()



        if (this.model.isWin) {
            await this.controller.openPopUp(GameOverWinPopup, this.model)
        } else {
            await this.controller.openPopUp(GameOverPopUp, this.model)
        }

        this.scheduleOnce(this.onNext,1)
    }

    onNext(){
        this.stateMachine.applyState(GameRememberState,[true])
    }
}
