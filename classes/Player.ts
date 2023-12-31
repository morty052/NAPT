/* eslint-disable @typescript-eslint/ban-ts-comment */
import { player } from "../types";
import Toast from "react-native-root-toast";

export type Debuffs = "crushed" | "confused" | "snared" | "empowered" | "none";
export type characterName =
  | "Arhuanran"
  | "Athena"
  | "Da Vinci"
  | "Ife"
  | "Washington"
  | "Confucious";

class Player {
  username;
  points;
  lives;
  powerBars;
  ultimateBars;
  character;
  characterName;
  characterAvatar;
  status;
  statuseffects;
  tryTest;
  takeDamage;
  increasePoints;
  callPowers;
  ultimate;
  callDebuff;
  Debuff;
  teamUp;
  partners?: player[];
  enemies?: player[];
  questions: {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }[];

  constructor({
    character,
    characterAvatar,
    lives,
    peeks,
    ultimates,
    status,
    statuseffects,
    username,
    questions,
  }: player) {
    const { name: characterName } = character;
    this.characterAvatar = characterAvatar;
    this.characterName = characterName;
    this.powerBars = peeks;
    this.lives = lives;
    this.ultimateBars = ultimates;
    (this.status = status), (this.statuseffects = statuseffects);

    this.questions = questions;

    // * FUNCTION TO CALL SEND DEBUFF
    //  SEND DEBUFF IS DEFINED WITHIN PLAYER OBJECT
    this.callDebuff = (props: {
      target_name: string;
      name: characterName;
      sender: string;
    }): { debuff: Debuffs; target_name: string; sender: string } => {
      console.log("Sending debuff");
      return this.SendDebuff(props);
    };

    // * FUNCTION TO APPLY DEBUFF
    // * FUNCTION CALLS APPLY DEBUFF FUNCTION DEFINED IN PLAYER OBJECT
    this.Debuff = (props: {
      debuff: Debuffs;
      target_name: string;
      sender: string;
    }) => {
      this.ApplyDebuff(props);
    };

    this.tryTest = (number: number) => {
      this.Test(number);
    };

    this.username = username;
    this.points = 0;

    this.character = character;

    this.takeDamage = this.Damage;

    this.increasePoints = this.incPoints;

    this.callPowers = this.Powers;

    this.ultimate = this.PowerUps;

    this.teamUp = (partner: player) => {
      this.pushPartner(partner);
    };
  }

  // Damage = () => {
  //   if (this.lives <= 0) {
  //     return console.log("This person died");
  //   }

  //   this.lives = this.lives - 1;

  //   console.log("Damage taken");
  // };

  Damage = () => {
    if (this.lives !== undefined && this.lives <= 0) {
      return console.log("This person died");
    }

    if (this.lives !== undefined) {
      this.lives = this.lives - 1;
    }

    console.log("Damage taken");
  };

  incPoints = () => {
    this.points = this.points + 10;
  };

  pushPartner = (partner: player) => {
    this.partners?.push(partner);
  };

  findEnemy = () => {
    const enemy = this.enemies?.find((enemy) => (enemy.username = "cvb"));
    console.log(enemy);
  };

  // * PLAYER CHARACTER ULTIMATE ACTIONS
  PowerUps = (props: { func: (name: string) => void }) => {
    const { func } = props;

    // * destructure name from player characater passed in player contructor
    const { name } = this.character;

    /*
     * handle player lives and powerbars from within Player object
     * send back character name to handle changes in ui
     */
    switch (name) {
      case "Arhuanran":
        this.powerBars = this.powerBars + 2;
        func("Arhuanran");
        break;
      case "Ife":
        if (this.ultimateBars == 0) {
          return console.error("no more ultimates");
        }

        if (this.lives) {
          this.lives = this.lives + 1;
        }
        this.powerBars = this.powerBars - 2;
        this.ultimateBars = this.ultimateBars - 1;
        func("Ife");
        break;
      case "Da Vinci":
        if (this.powerBars == 0) {
          return console.error("no more power bars");
        }
        if (this.lives) {
          this.lives = this.lives + 1;
        }
        this.powerBars = this.powerBars - 2;
        func("Da Vinci");
        break;

      default:
        break;
    }
  };

  // * PLAYER  CHARACTER ANSWER REVEAL FUNCTIONS
  Powers = (props: { func: () => void; level: number }) => {
    const { func, level } = props;
    const { name } = this.character;
    const powerBars = this.powerBars;
    // let level = 0;

    const { correct_answer } = this.questions && this.questions[level];

    const nextQuestion = this.questions && this.questions[level + 1];
    const thirdQuestion = this.questions && this.questions[level + 2];
    const { correct_answer: nextAnswer } = nextQuestion;
    const { correct_answer: thirdAnswer } = thirdQuestion;

    const decreasePowerBars = () => {
      this.powerBars = powerBars - 1;
    };

    if (this.powerBars == 0) {
      return console.error("no more power bars");
    }

    switch (name) {
      case "Athena":
        console.info(`${nextAnswer}`);
        decreasePowerBars();
        break;
      case "Washington":
        console.log("White Man");
        console.info(`${correct_answer}`);
        decreasePowerBars();
        break;
      case "Ife":
        console.log("Black Queen");
        console.info(`${thirdAnswer}`);
        Toast.show(`${thirdAnswer}`, {
          duration: Toast.durations.LONG,
          position: 40,
        });
        decreasePowerBars();
        break;
      case "Da Vinci":
        console.log("za Painter");
        console.info(`${thirdAnswer}`);
        decreasePowerBars();
        break;
      case "Confucious":
        console.log("za Painter");
        console.info(`${correct_answer.substring(0, 2)}`);
        decreasePowerBars();
        break;
      case "Arhuanran":
        Toast.show(`${correct_answer}`, {
          duration: Toast.durations.LONG,
          position: 40,
        });
        decreasePowerBars();
        break;

      default:
        break;
    }

    // * HANDLE UI CHANGES AND ANY FUTHER EFFECTS
    func();
  };

  // * PLAYER CHARACTER DEBUFF EFFECTS TYPES
  ApplyDebuff = (props: {
    debuff: Debuffs;
    target_name: string;
    sender: string;
  }) => {
    const { debuff, target_name } = props;
    console.log(props);

    //
    if (target_name == this.username) {
      console.log(`this player ${target_name} got ${debuff}`);
      this.powerBars = this.powerBars && this.powerBars - 1;
      // console.log(this.lives);
    } else {
      return console.log("not you");
    }
    // switch (debuffs) {
    //   case "confused":
    //     this.powerBars = this.powerBars - 1;
    //     break;
    //   case "crushed":
    //     this.lives = this.lives && this.lives - 1;
    //     break;
    //   case "empowered":
    //     break;
    //   case "none":
    //     break;
    //   case "snared":
    //     break;

    //   default:
    //     break;
    // }
  };

  // FUNCTION TO SEND DEBUFF
  SendDebuff = (props: {
    target_name: string;
    name: characterName;
  }): { debuff: Debuffs; target_name: string; sender: string } => {
    const { target_name, name } = props;
    const sender = this.username;

    // DETERMINE TYPE OF DEBUFF TO SEND USING CHARACTER NAME
    const deterMineDebuff = () => {
      let debuff: Debuffs;
      switch (name) {
        case "Ife":
          debuff = "confused";
          return debuff;
        case "Arhuanran":
          debuff = "crushed";
          return debuff;
        default:
          break;
      }
    };

    // GET DEBUFF FROM DETERMINED TYPE
    const debuff = deterMineDebuff();

    /*
     * RETURN DEBUFF
     * RETURN TARGET NAME
     * RETURN SENDER
     */
    return {
      // @ts-ignore
      debuff,
      target_name,
      sender,
    };
  };

  // ? SOCKET TEST ?
  Test = (message: number): number => {
    console.log(message);
    return message;
  };
}

export default Player;
