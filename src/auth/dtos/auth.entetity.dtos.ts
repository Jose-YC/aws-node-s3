import { CustomError } from '../../handler';
import { UserEntity } from '../../user/entity/user';



export class AuthEntityDtos {

    constructor(
        public user:UserEntity,
        public token:string,

    ){}

    static fromObject= (object:{[key:string]:any} ):AuthEntityDtos => {
        const {user, token, } = object;
        
        const userEntity = UserEntity.fromObject(user);
        if (!token) CustomError.badRequest('no se genero el token');
            
        return new AuthEntityDtos(userEntity, token);
    }
}