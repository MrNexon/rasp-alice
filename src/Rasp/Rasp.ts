import {IRasp} from "./IRasp";
import {RaspTypeMnemonic} from "./RaspTypeMnemonic";
import {IClassRoom} from "./IClassRoom";

export class Rasp implements IRasp {
    //addSubject: String | undefined;
    classRoom: IClassRoom | undefined;
    pairNumber: number | undefined;
    subject: String | undefined;
    type: RaspTypeMnemonic | undefined;

    constructor() {

    }
}