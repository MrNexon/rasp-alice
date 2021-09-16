import {IRasp} from "../Rasp/IRasp";
import SpeakPhrase from "./SpeakPhrase";
import {PairName} from "./PairName";
import Axios from "axios";
import {ScheduleNumberPair} from "../DSTU/SchedulePair";
import {GroupNames} from "../DSTU/GroupNames";

export default class SpeakCompiler {
    static async Rasp(groupId: number, date: Date, lessons: IRasp[]): Promise<string> {
        let ask = [];

        if (lessons.length < 1)
            return SpeakPhrase.RaspNone(date);
        console.info(groupId);

        // @ts-ignore
        ask.push(SpeakPhrase.RaspStart(GroupNames[groupId], date));


        for (let lesson of lessons)
            ask.push(await this.Pair(lesson));

        ask.push(SpeakCompiler.EndQ());

        return ask.join(" ");
    }

    static async PairFirst(groupId: number, date: Date, lessons: IRasp[]): Promise<string> {
        let ask = [];

        if (lessons.length < 1)
            return SpeakPhrase.RaspNone(date);

        // @ts-ignore
        ask.push(SpeakPhrase.RaspStartFirst(date));
        if (lessons[0].pairNumber === 2) ask.push("ко");
        else ask.push("к")


        ask.push(await this.PairOne(lessons[0]));

        ask.push(SpeakCompiler.EndQ());

        return ask.join(" ");
    }

    static async Pair(lesson: IRasp): Promise<string | null> {
        let ask = [];

        // @ts-ignore
        ask.push(PairName[lesson.pairNumber]);
        ask.push("парой:");

        if (typeof lesson.subject !== "string") return null;

        let phrase = await Axios.get("http://pyphrasy.herokuapp.com/inflect?forms=datv&phrase=" + encodeURI(lesson.subject));
        ask.push(lesson.type);
        ask.push("по");
        ask.push(phrase.data.datv + ".");
        if (lesson.classRoom?.distance)
            ask.push("Пара дистанционная!");

        return ask.join(" ") + ".";
    }

    static async PairOne(lesson: IRasp): Promise<string | null> {
        let ask = [];

        // @ts-ignore
        ask.push(PairName[lesson.pairNumber]);
        ask.push("паре.");
        ask.push("Она начинается в");
        // @ts-ignore
        ask.push(ScheduleNumberPair[lesson.pairNumber] + ".");

        if (lesson.classRoom?.distance)
            ask.push("Пара дистанционная!");
        else {
            if (typeof lesson.classRoom?.corpus === "string" && !isNaN(parseInt(lesson.classRoom?.corpus)))
                ask.push(this.TwoNumberRus(parseInt(lesson.classRoom?.corpus)));
            else
                ask.push(lesson.classRoom?.corpus);


            if (lesson.classRoom?.classRoom) {
                ask.push("к+орпус.");
                ask.push("Аудитория");
                ask.push(this.HundredNumberRus(parseInt(lesson.classRoom.classRoom)));
            }
        }

        return ask.join(" ");
    }

    static EndQ(): string {
        return "Что нибуть еще?";
    }

    static HundredNumberRus(num: number): string {
        //let n = num.toString().split("");
        let ask = [];

        switch (parseInt("" + num / 100)) {
            case 1:
                ask.push("сто");
                break;
            case 2:
                ask.push("двести");
                break;
            case 3:
                ask.push("триста");
                break;
            case 4:
                ask.push("четыреста");
                break;
            case 5:
                ask.push("пятьсот");
                break;
            case 6:
                ask.push("шестьсот");
                break;
            case 7:
                ask.push("семьсот");
                break;
            case 8:
                ask.push("восемьсот");
                break;
            case 9:
                ask.push("девятьсот");
                break;
        }

        if (num % 100 > 9 && num % 100 < 20) {
            switch (num % 100) {
                case 10:
                    ask.push("десять");
                    break;
                case 11:
                    ask.push("одинадцать");
                    break;
                case 12:
                    ask.push("двенадцать");
                    break;
                case 13:
                    ask.push("тринадцать");
                    break;
                case 14:
                    ask.push("четырнадцать");
                    break;
                case 15:
                    ask.push("пятнадцать");
                    break;
                case 16:
                    ask.push("шеснадцать");
                    break;
                case 17:
                    ask.push("семнадцать");
                    break;
                case 18:
                    ask.push("восемнадцать");
                    break;
                case 19:
                    ask.push("девятнацать");
                    break;

            }
        }

        if (num % 100 > 19) {
            switch (parseInt("" + num % 100 / 10)) {
                case 2:
                    ask.push("двадцать");
                    break;
                case 3:
                    ask.push("тридцать");
                    break;
                case 4:
                    ask.push("сорок");
                    break;
                case 5:
                    ask.push("пятьдесят");
                    break;
                case 6:
                    ask.push("шестьдесят");
                    break;
                case 7:
                    ask.push("семьдесят");
                    break;
                case 8:
                    ask.push("восемьдесят");
                    break;
                case 9:
                    ask.push("девяносто");
                    break;
            }
        }

        if (num % 100 < 10 || num % 100 > 19)
            switch (num % 10) {
                case 1:
                    ask.push("один");
                    break;
                case 2:
                    ask.push("два");
                    break;
                case 3:
                    ask.push("три");
                    break;
                case 4:
                    ask.push("четыре");
                    break;
                case 5:
                    ask.push("пять");
                    break;
                case 6:
                    ask.push("шесть");
                    break;
                case 7:
                    ask.push("семь");
                    break;
                case 8:
                    ask.push("восемь");
                    break;
                case 9:
                    ask.push("девять");
                    break;
            }

        return ask.join(" ");
    }

    static TwoNumberRus(num: number): string {
        //let n = num.toString().split("");
        let ask = [];

        if (num > 9 && num < 20) {
            switch (num) {
                case 10:
                    ask.push("десятый");
                    break;
                case 11:
                    ask.push("одинадцатый");
                    break;
                case 12:
                    ask.push("двенадцатый");
                    break;
                case 13:
                    ask.push("тринадцатый");
                    break;
                case 14:
                    ask.push("четырнадцатый");
                    break;
                case 15:
                    ask.push("пятнадцатый");
                    break;
                case 16:
                    ask.push("шеснадцатый");
                    break;
                case 17:
                    ask.push("семнадцатый");
                    break;
                case 18:
                    ask.push("восемнадцатый");
                    break;
                case 19:
                    ask.push("девятнацатый");
                    break;

            }
        }

        if (num > 19 && num % 10 === 0) {
            switch (num) {
                case 20:
                    ask.push("двадцатый");
                    break;
                case 30:
                    ask.push("тридцатый");
                    break;
                case 40:
                    ask.push("сороковой");
                    break;
                case 50:
                    ask.push("пятидесятый");
                    break;
                case 60:
                    ask.push("шестидесятый");
                    break;
                case 70:
                    ask.push("семидесятый");
                    break;
                case 80:
                    ask.push("восьмидесятый");
                    break;
                case 90:
                    ask.push("девяностый");
                    break;
            }
        } else if (num > 19) {
            switch (parseInt("" + num / 10)) {
                case 2:
                    ask.push("двадцать");
                    break;
                case 3:
                    ask.push("тридцать");
                    break;
                case 4:
                    ask.push("сорок");
                    break;
                case 5:
                    ask.push("пятьдесят");
                    break;
                case 6:
                    ask.push("шестьдесят");
                    break;
                case 7:
                    ask.push("семьдесят");
                    break;
                case 8:
                    ask.push("восемьдесят");
                    break;
                case 9:
                    ask.push("девяносто");
                    break;
            }
        }


        if (num < 10 || num > 19) {
            switch (num % 10) {
                case 1:
                    ask.push("первый");
                    break;
                case 2:
                    ask.push("второй");
                    break;
                case 3:
                    ask.push("третий");
                    break;
                case 4:
                    ask.push("четвертый");
                    break;
                case 5:
                    ask.push("пятый");
                    break;
                case 6:
                    ask.push("шестой");
                    break;
                case 7:
                    ask.push("седьмой");
                    break;
                case 8:
                    ask.push("восьмой");
                    break;
                case 9:
                    ask.push("девятый");
                    break;
            }
        }
        return ask.join(" ");
    }
}