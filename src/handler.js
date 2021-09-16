import DSTU from "./DSTU/DSTU";
import DateParser from "./Util/DateParser";
import {Group} from "./DSTU/Group";
import NameParser from "./Util/NameParser";
import SpeakCompiler from "./Util/SpeakCompiler";
import {GroupNames} from "./DSTU/GroupNames";

const { reply } = require("alice-renderer");
const { Alice } = require("yandex-dialogs-sdk");

const alice = new Alice();

/*
alice.command(/на завтра/, () => {
    //console.log(ctx.nlu.entities);
    return reply`ok`;
});*/

/*alice.command(/паре/ig, async (ctx) => {
    let date = DateParser.Parse(ctx);
    let name = NameParser.Parse(ctx);
    let by = Group[name];

    if (!name) by = Group.данила;
    console.log(date);

    return reply([await SpeakCompiler.PairFirst(GroupNames[by], date, await DSTU.getRasp(date, by))]);
});

alice.command(/на [а-я]*!/, async (ctx) => {
    let date = DateParser.Parse(ctx);
    /!*let name = NameParser.Parse(ctx);
    let by = Group[name];

    if (!name) by = Group.данила;*!/
    console.log(date);
    //return reply([await SpeakCompiler.Rasp(GroupNames[by], date, await DSTU.getRasp(date, by))]);
});

alice.command('', async (ctx) => {
    return reply`Прив+ет!`;
});*/

const atDay = (async (date, by) => {
    return reply([await SpeakCompiler.Rasp(by, date, await DSTU.getRasp(date, by))]);
});

const atPair = (async (date, by) => {
    return reply([await SpeakCompiler.PairFirst(by, date, await DSTU.getRasp(date, by))]);
});

alice.any((ctx) => {
    let date = DateParser.Parse(ctx);
    let name = NameParser.Parse(ctx);
    let by = Group[name];
    if (!name) by = Group.данила;

    if (ctx.originalUtterance.match(/пар/)) return atPair(date, by);
    else if (ctx.originalUtterance.match(/[на во] [а-я]*/)) return atDay(date, by);
    else if (ctx.originalUtterance.match(/нет/)) return reply.end`Ну и ладно. Попробуй что нибуть у меня еще спросить, Pidaras... Pizd+a тебе!`

    if (ctx.originalUtterance === "")
        return reply`На какой день вы хотите узнать расписание?`;
    else return reply`Я не могу распознать вашу команду, попробуйте еще раз`;
});
/*

const middleware = () => {
    return async (ctx, next) => {
        //console.log(ctx);
        return next(ctx);
    }
}

alice.use(middleware());*//*
alice.on("request", (ctx) => {
    console.log(ctx);
})*/


const server = alice.listen(3000, "/handler");
console.log('Server started at 3000')
