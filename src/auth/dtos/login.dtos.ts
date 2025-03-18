import { regularExps } from '../../handler/regularexpr';


export class LoginDtos {

    private constructor(
        public readonly email:string,
        public readonly password:string, 
    ){}

    static create(props: {[key:string]:any}): [string?, LoginDtos?]{
        const {email, password} = props;
        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password to short'];
        return [undefined, new LoginDtos(email, password)]
    }
}