import PopUpComponent from "./popupcomponent";
import GameModel from "../gamemodel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverPopUp extends PopUpComponent{

    @property(cc.Label)
    lbScore:cc.Label = null;

    @property(cc.Label)
    lbMessage:cc.Label = null;

    onOpen(model: GameModel) {
        this.lbScore.string = "Your score:" + model.score;
        this.lbScore.node.active = false

        if(!model.isWin){
            this.lbMessage.string = "Nice try! Play again to improve your \n" +
                "skills and train your brain to perform.\n" +
                "\n" +
                "Good luck and aim for high score!\n";
        }else{
            this.lbMessage.string = "Congratulation!\n You pass all of existing questions.";
        }
    }

    onClose(){
        this.close(true);
    }
}
