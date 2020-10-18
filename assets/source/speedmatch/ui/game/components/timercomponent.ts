const { ccclass, property } = cc._decorator;

@ccclass
export default class TimerComponent extends cc.Component {
  @property(cc.Label)
  lbCountDown: cc.Label = null;

  @property(cc.Sprite)
  progressLb: cc.Sprite = null;

  @property(cc.Sprite)
  progressSecond: cc.Sprite = null;

  finishAt: number = 0;

  total: number = 0;

  startedAt: number = 0;

  private _isBlinkRun = false;

  onLoad() {}

  play(total: number, finishAt: number) {
    this.total = total;
    this.finishAt = finishAt;
  }

  lateUpdate() {
    if (this.finishAt < Date.now()) {
      this.lbCountDown.string = `${0}`;
      return;
    }
    let left = (this.finishAt - Date.now()) / 1000;

    if (left > 0) {
      this.progressLb.fillRange = (1 * left) / this.total;
      this.progressSecond.fillRange = 1 - (1 * left) / this.total;

      let vl = Math.max(
        0,
        Math.ceil((this.finishAt - new Date().getTime()) / 1000)
      );

      if (vl < 6 && !this._isBlinkRun) {
        let sq = cc.sequence([
          cc.blink(5, 5),
          cc.callFunc(() => {
            this._isBlinkRun = false;
          }),
        ]);
        this.lbCountDown.node.runAction(sq);
        this._isBlinkRun = true;
      }

      this.lbCountDown.string = `${vl}`;
      return;
    }
  }
}
