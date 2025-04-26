import { CustomError } from "../../handler";

export class PhotoEntity {

    constructor(
        public readonly id:string,
        public readonly url:string,
        public readonly type:string,
        public readonly userid:string
    ){}

    static fromObject= (object:{[key:string]:any} ):PhotoEntity => {
        const { id, url, type, userid } = object;

        if (!id) CustomError.badRequest('id not exist');
        if (!url) CustomError.badRequest('url not exist');
        if (!type) CustomError.badRequest('type not exist');
        if (!userid) CustomError.badRequest('userid not exist');
        return new PhotoEntity(id, url, type, userid);
    }
}