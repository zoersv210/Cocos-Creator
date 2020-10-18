const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionComponent extends cc.Component {
  @property(cc.Label)
  lbItemValue: cc.Label = null;

  @property(cc.Label)
  lbQuestion1: cc.Label = null;

  @property(cc.Label)
  lbQuestion2: cc.Label = null;

  @property(cc.Sprite)
  spIcon: cc.Sprite = null;

  setQuestion(vl: string, q1: string, q2: string, sp: cc.SpriteFrame) {
    this.lbItemValue.string = vl.toUpperCase();
    this.lbQuestion1.string = q1 + "x";
    this.lbQuestion2.string = q2.toUpperCase();
    this.spIcon.spriteFrame = sp;
    // this.spIcon.node.scale = 0.65;
  }
}
