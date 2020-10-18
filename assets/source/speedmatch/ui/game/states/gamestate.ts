import Command from "../../../../coregames/command";
import GameModel from "../gamemodel";
import GameView from "../gameview";
import StateMachine from "../../../../coregames/statemachine";

export default class GameState extends Command{
    controller:any
    model:GameModel
    view:GameView
    stateMachine:StateMachine

    onStart(args: Array<any>) {
        super.onStart(args);

        this.controller = this.node.getComponent("gamecontroller")
        this.model = this.controller.model
        this.view = this.controller.view
        this.stateMachine = this.controller.stateMachine
    }
}
