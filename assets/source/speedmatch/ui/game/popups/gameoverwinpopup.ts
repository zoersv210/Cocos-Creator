import PopUpComponent from "./popupcomponent";
import GameModel from "../gamemodel";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverWinPopup extends PopUpComponent {

    @property(cc.Label)
    lbGameplayScore: cc.Label = null;

    @property(cc.Label)
    lbTimeBonus: cc.Label = null;

    @property(cc.Label)
    lbDifficultyBonus: cc.Label = null;

    @property(cc.Label)
    lbStreakBonus: cc.Label = null;

    @property(cc.Label)
    lbTotalScore: cc.Label = null;


    onOpen(model: GameModel) {
        let gScore = `Gameplay Score: ${model.score}`
        let tbScore = `Time Bonus: ${model.getTimeBouns(model.gameTimeForBonus)}`
        let difScore = `Difficulty Bonus: ${model.getDifficultyBonus(model.currentStage + 1)}`
        let streakScore = `Streak Bonus: ${model.getStreakBonus(model.getMaximumStreak())}`
        let totalScore = `Your Total Score: ${model.getTotalBonus()}`

        console.log('time', model.gameTimeForBonus)

        this.lbGameplayScore.string = gScore;
        this.lbTimeBonus.string = tbScore;
        this.lbDifficultyBonus.string = difScore;
        this.lbStreakBonus.string = streakScore
        this.lbTotalScore.string = totalScore
    }

    onClose() {
        this.close(true);
    }
}
