import GameState from "./gamestate";
import GamePlayState from "./gameplaystate";
import GameModel from "../gamemodel";

export default class GameRememberState extends GameState{

    async onStart(args: Array<any>) {
        super.onStart(args);


        this.model.reset();
        // this.model.currentStage = GameModel.randomInt(0,this.model.levels.length);

        // cc.log(this.model.levels[this.model.currentStage].questions);


        this.stateMachine.applyState(GamePlayState);

    }

}
