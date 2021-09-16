import {IContext} from "yandex-dialogs-sdk";
import {IApiEntity } from "yandex-dialogs-sdk/dist/api/nlu";
import {WeekName} from "./WeekName";

export default class DateParser {
    static Parse(ctx: IContext): Date {
        if (ctx.nlu?.entities) {
            let date = this._parseNlu(ctx.nlu?.entities);
            if (date) return date;
        }

        let matcher = ctx.originalUtterance.match(/(?:на|во|в) ([а-я]*)/i);
        console.log(matcher);

        let date = new Date();

        let week = 0;

        if (matcher) {
            switch (matcher[1]) {
                case WeekName.Monday:
                    week = 1;
                    break;
                case WeekName.Tuesday:
                    week = 2;
                    break;
                case WeekName.Wednesday:
                    week = 3;
                    break;
                case WeekName.Thursday:
                    week = 4;
                    break;
                case WeekName.Friday:
                    week = 5;
                    break;
                case WeekName.Saturday:
                    week = 6;
                    break;
                case WeekName.Sunday:
                    week = 0;
                    break;
            }
        }

        if (date.getDay() > week)
            date.setDate(date.getDate() + (7 - date.getDay() + week));
        else if (date.getDay() < week)
            date.setDate(date.getDate() + week);

        return date;
    }


    static _parseNlu(entities: IApiEntity[]): Date | null {
        let date = new Date();

        for (let entity of entities)
            if (entity.type === "YANDEX.DATETIME") {
                if (entity.value.day)
                    date.setDate((entity.value.day_is_relative ? date.getDate() + entity.value.day : entity.value.day));

                if (entity.value.month)
                    date.setMonth((entity.value.month_is_relative ? date.getMonth() + entity.value.month : entity.value.month - 1));
                return date;
            }

        return null;
    }

    static AtDate(date: Date): string {
        // @ts-ignore
        let at = Math.round((date - new Date()) / (1000 * 3600 * 24));

        switch (at) {
            case 0:
                return "сегодня";
            case 1:
                return "завтра";
            default:
                switch (date.getDay()) {
                    case 0:
                        return WeekName.Sunday;
                    case 1:
                        return WeekName.Monday;
                    case 2:
                        return WeekName.Tuesday;
                    case 3:
                        return WeekName.Wednesday;
                    case 4:
                        return WeekName.Thursday;
                    case 5:
                        return WeekName.Friday;
                    case 6:
                        return WeekName.Saturday;

                }
        }

        return "какое-то время"
    }

}