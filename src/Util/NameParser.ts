import {IApiEntity} from "yandex-dialogs-sdk/dist/api/nlu";
import {IContext} from "yandex-dialogs-sdk";

export default class NameParser {
    static Parse(ctx: IContext): string | boolean {
        if (ctx.nlu?.entities)
            return this._parseNlu(ctx.nlu?.entities);

        return false;
    }

    static _parseNlu(entities: IApiEntity[]): string | boolean {
        for (let entity of entities)
            if (entity.type === "YANDEX.FIO" && entity.value.first_name)
                return entity.value.first_name;

        return false;
    }

}