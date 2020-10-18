import PopUpComponent from "./popupcomponent";
import GameController from "../gamecontroller";
import HowToPlayPopUp from "./howtoplaypopup";
import property = cc._decorator.property;

const {ccclass} = cc._decorator;

@ccclass
export default class MenuPopUp extends PopUpComponent{

    isRestart:boolean = false;

    @property(GameController)
    gameController:GameController = null;

    onOpen(args: any) {
        super.onOpen(args);
        this.isRestart = false;
    }

    onRestart(){
        this.isRestart = true;

        this.onClose();
    }

    async onHelp(){
        await this.gameController.openPopUp(HowToPlayPopUp);
    }

    onClose(){
        this.close(true)
    }
}
