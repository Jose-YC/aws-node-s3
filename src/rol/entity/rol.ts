import { CustomError } from "../../handler";

export class RolEntity {

    constructor(
        public name:string,
        public description:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):RolEntity => {
        const { description, name } = object;
        if (!description) CustomError.badRequest('description not exist');
        if (!name) CustomError.badRequest('name not exist');
        return new RolEntity(name, description);
    }
}
