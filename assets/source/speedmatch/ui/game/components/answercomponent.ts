// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class AnswerComponent extends cc.Component {

    @property(cc.SpriteFrame)
    spriteCorrect: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteWrong: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteRegular: cc.SpriteFrame = null;

    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.Sprite)
    sprite:cc.Sprite = null;

    answer:string = "";

    applyModel(value){
        this.answer = value;
        this.label.string = value;
    }

    checkAnswer(answer){
        if(answer == this.answer)
            this.sprite.spriteFrame = this.spriteCorrect;
        else
            this.sprite.spriteFrame = this.spriteWrong;

        const self = this;

        this.sprite.node.runAction(cc.sequence([cc.delayTime(0.5),cc.callFunc(()=>{
            self.sprite.spriteFrame = self.spriteRegular;
        })]) );

        return this.answer === answer
    }




    onClick(){
        this.node.emit("tap",this)
    }
}
