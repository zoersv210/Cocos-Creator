const { ccclass, property } = cc._decorator;

@ccclass
export default class PriceWindowComponent extends cc.Component {

    @property(cc.SpriteFrame)
    spriteCorrect: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteWrong: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteRegular: cc.SpriteFrame = null;

    @property(cc.Sprite)
    ticksp: cc.Sprite = null;

    @property(cc.Sprite)
    losesp: cc.Sprite = null;


    @property(cc.Label)
    label: cc.Label = null;

    start() {

    }

    setAnswer(isCorrect: boolean) {
        let sprite = this.node.getComponent(cc.Sprite);
        this.label.node.active = false;

        if (isCorrect) {
            sprite.spriteFrame = this.spriteCorrect
            this.ticksp.node.active = true;

        }
        else {
            sprite.spriteFrame = this.spriteWrong
            this.losesp.node.active = true;
        }


        this.node.runAction(cc.sequence([cc.delayTime(0.5), cc.callFunc(() => {
            sprite.spriteFrame = this.spriteRegular
            this.label.node.active = true
            this.ticksp.node.active = false;
            this.losesp.node.active = false
        })]));
    }

    // update (dt) {}
}
