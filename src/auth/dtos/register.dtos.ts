import { regularExps } from '../../handler/regularexpr';

export class RegisterDtos {

    private constructor(
        public readonly id:string,
        public readonly email:string,
        public readonly name:string,
        public readonly password:string, 
    ){}

    static create(props: {[key:string]:any}): [string?, RegisterDtos?]{
        const {email, name, id, password} = props;
        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password to short'];
        if (!name) return ['Missing name'];
        return [undefined, new RegisterDtos(id, email, name, password)]
    }
}