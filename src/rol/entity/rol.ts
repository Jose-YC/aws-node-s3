export class RolEntity {

    constructor(
        public name:string,
        public description:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):RolEntity => {
        const { description, name } = object;
        if (!description) console.log('description not exist');
        if (!name) console.log('name not exist');
        return new RolEntity(name, description);
    }
}
