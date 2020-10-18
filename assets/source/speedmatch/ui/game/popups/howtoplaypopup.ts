import PopUpComponent from "./popupcomponent";
import GameModel from "../gamemodel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HowToPlayPopUp extends PopUpComponent{

    onClose(){
        this.close(true)
    }
}
