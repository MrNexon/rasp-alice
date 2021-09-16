import DateParser from "./DateParser";
import {WeekName} from "./WeekName";
//import {TimerNumberPair} from "../DSTU/SchedulePair";

const RaspNoneText = [
    "Отличной идеей будет пойти бухать!",
    "Убери наконец-то в комнате. Свинья...",
    "Спасибо Месхи!",
    "Но ты все равно идешь в вуз, так-как ты - dolbaeb!",
    "И хватит уже у меня спрашивать, я не хочу с тобой говорить!!!"
]

export default class SpeakPhrase {
    static RaspStart(groupName: string, atDate: Date): string {
        let at = DateParser.AtDate(atDate);

        return `Расписание группы ${groupName} на ${at}.`;
    }

    static RaspStartFirst(atDate: Date): string {
        let at = DateParser.AtDate(atDate);

        if (at === WeekName.Tuesday)
            return `Во ${at} вам`;
        else if (at === "сегодня" || at === "завтра") return `${at} вам`
        else return `В ${at} вам`;
    }

    static RaspNone(atDate: Date): string {
        let at = DateParser.AtDate(atDate);
        let raspText = RaspNoneText[this.randomInteger(0, 4)];

        return `Пар на ${at} нет! ${raspText}`;

    }

    /*static SleepTimer(pairNumber: number): string {
        let time: number;
        // @ts-ignore
        time += TimerNumberPair[pairNumber][0] * 3600;
        time += TimerNumberPair[pairNumber][1] * 60;


        if (pairNumber >= 3) return `Вы можете уснуть в любое время, так как вам к ${pairNumber} паре!`;

        //while (!(dT.getHours() === 22 || dT.getHours() === 22))
    }*/

    static randomInteger(min: number, max: number): number {
        // получить случайное число от (min-0.5) до (max+0.5)
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
}