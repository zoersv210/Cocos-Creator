const {ccclass, property} = cc._decorator;

@ccclass
export default class IndicatorComponent extends cc.Component {

    @property(cc.SpriteFrame)
    iconFrames:Array<cc.SpriteFrame> = []

    @property(cc.SpriteFrame)
    backgroundFrames:Array<cc.SpriteFrame> = []

    @property(cc.Sprite)
    icon:cc.Sprite = null

    @property(cc.Sprite)
    background:cc.Sprite = null

    @property(cc.Node)
    decals:cc.Node = null

    @property(cc.Label)
    lbText:cc.Label = null

    start () {

    }

    protected onLoad(): void {
        this.node.scale = 0
        this.decals.runAction(cc.scaleTo(0,0.5))
    }

    static ItemOk:number = 0
    static ItemNo:number = 1

    show(item:number, icon:boolean = true){

        const animationUpTime:number = 0.3
        const animationDownTime:number = 0.3
        const animationStayTime:number = 0.3

        if(icon){
            this.icon.node.active = true
            this.icon.spriteFrame = this.iconFrames[item]
            this.lbText.node.active = false

            this.background.spriteFrame = this.backgroundFrames[item]
        }else{
            this.background.spriteFrame = this.backgroundFrames[0]
            this.icon.node.active = false
            this.lbText.node.active = true
            this.lbText.string = "x" + item
        }

        this.decals.runAction(cc.sequence([cc.scaleTo(animationUpTime,1).easing(cc.easeBackOut()),
        cc.delayTime(animationStayTime),cc.scaleTo(animationDownTime,0).easing(cc.easeBackIn())]))

        this.node.runAction(cc.sequence([cc.scaleTo(animationUpTime,1).easing(cc.easeBackOut()),
        cc.delayTime(animationStayTime),
        cc.scaleTo(animationDownTime,0).easing(cc.easeBackIn())]))
    }
}
