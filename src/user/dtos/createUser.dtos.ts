import { regularExps } from '../../handler/regularexpr';

export class CreateUserDtos {

    private constructor(
        public readonly id:string,
        public readonly email:string,
        public readonly name:string,
        public readonly password:string, 
        public readonly rolName:string,
    ){}

    static create(props: {[key:string]:any}): [string?, CreateUserDtos?]{
        const { id, email, name, password, rolName} = props;
        if (!id) return ['Missing id'];
        if (!name) return ['Missing name'];
        if (!rolName) return ['Missing rol'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password to short'];
        return [undefined, new CreateUserDtos(id, email, name, password, rolName)] 
    }
}