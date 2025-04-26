import { CustomError } from '../../handler';
export class UserEntity {

    constructor(
        public id:string,
        public name:string,
        public email:string,
        public rol:string,
    ){}

    static fromObject= (object:{[key:string]:any} ):UserEntity => {
        const { id, name, email, password, rol} = object;
        if (!id) CustomError.badRequest('id not exist');
        if (!name) CustomError.badRequest('name not exist');
        if (!email) CustomError.badRequest('email not exist');
        if (!rol) CustomError.badRequest('rol not exist');
        return new UserEntity(id, name, email, rol);
    }
}