export class RolEntity {

    constructor(
        public id:string,
        public name:string,
        public description:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):RolEntity => {
        const { id, name, description} = object;
        if (!id) console.log('id not exist');
        if (!name) console.log('name not exist');
        if (!description) console.log('description not exist');
        return new RolEntity(id, name, description);
    }
}
