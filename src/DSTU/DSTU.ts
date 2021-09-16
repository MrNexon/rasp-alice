import {Group} from "./Group";
import Axios from "axios";
import {IRasp} from "../Rasp/IRasp";
import {LessonObject} from "./LessonObject";
import LessonParser from "./LessonParser";
import {SchedulePair} from "./SchedulePair";

export default class DSTU {
    static async getRasp(date: Date, groupId = Group.данила): Promise<IRasp[]> {
        let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let weekDay = date.getDay();

        let rasp = await Axios.get('https://edu.donstu.ru/api/Rasp?idGroup=' + groupId + '&sdate=' + dateString);

        let lessons: Map<number, IRasp> = new Map<number, IRasp>();

        for (let lesson of rasp.data.data.rasp) {
            if (weekDay !== lesson["деньНедели"]) continue;

            let lessonObject: LessonObject = lesson;
            if (lessonObject.дисциплина.indexOf('Учебно-тренировочный') > -1) continue;

            // @ts-ignore
            lessons.set(SchedulePair[lessonObject.начало], LessonParser.Parse(lessonObject));
        }

        let ras: IRasp[] = [];

        lessons.forEach((lesson) => {
            ras.push(lesson);
        })
        console.log(ras);


        return ras;
    }
}
