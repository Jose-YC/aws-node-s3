export class UserEntity {

    constructor(
        public id:string,
        public name:string,
        public email:string,
        public password:string,
        public rol:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):UserEntity => {
        const { id, name, email, password, rol} = object;
        if (!id) console.log('id not exist');
        if (!name) console.log('name not exist');
        if (!email) console.log('email not exist');
        if (!password) console.log('password not exist');
        if (!rol) console.log('rol not exist');
        return new UserEntity(id, name, email, password, rol);
    }
}