import GameView from "./gameview";
import GameModel from "./gamemodel";
import StateMachine from "../../../coregames/statemachine";
import PopUpComponent from "./popups/popupcomponent";
import GamePlayState from "./states/gameplaystate";
import Config from "../../domain/config";
import GameRememberState from "./states/gamerememberstate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(GameView)
    view: GameView = null;

    model:GameModel = null

    stateMachine:StateMachine = null


    start () {
        this.model = new GameModel()

        this.stateMachine = new StateMachine(this.node)

        this.view.applyModel(this.model)

        this.stateMachine.applyState(GameRememberState);
    }


    openPopUp(type,args = null){
        let popUp:PopUpComponent = this.node.getComponentInChildren(type)

        return popUp.open(args)
    }

    onQuit(){

    }

}
