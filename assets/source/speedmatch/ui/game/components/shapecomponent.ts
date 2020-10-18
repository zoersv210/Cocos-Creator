import Shape from "../../../domain/shape";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShapeComponent extends cc.Component {

    @property(cc.Sprite)
    spImage: cc.Sprite = null

    model:Shape = null

    @property(cc.SpriteFrame)
    frames:Array<cc.SpriteFrame> = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    applyModel(model:Shape){
        this.spImage.spriteFrame = this.frames[model.index]
        this.spImage.node.color = this.spImage.node.color.fromHEX(model.color)
    }

    // update (dt) {}
}
