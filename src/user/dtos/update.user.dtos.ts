import { regularExps } from '../../handler/regularexpr';


export class UpdateUserDtos {

    private constructor(
        public readonly id:string,
        public readonly name?:string,
        public readonly email?:string,
        public password?:string, 
    ){}

    get values(){
        const returnObj: {[key:string]: any} = { ':updateAt': new Date().toISOString() }
        if (this.email) returnObj[':email'] = this.email;
        if (this.name) returnObj[':name'] = this.name;
        if (this.password) returnObj[':password'] = this.password;
        return returnObj;
    }

    get expression(){
        let expression = 'SET _updateAt = :updateAt';
        if (this.email) expression += ', #email = :email';
        if (this.name) expression += ', #name = :name';
        if (this.password) expression += ', #password = :password';
        return expression;
    }

    get attributeNames(): { [key: string]: string } {
        const names: { [key: string]: any } = {};
        
        if (this.email) names['#email'] = 'email';
        if (this.name) names['#name'] = 'name';
        if (this.password) names['#password'] = 'password';
        
        return names;
      }

    static create(props: {[key:string]:any}): [string?, UpdateUserDtos?]{
        const { id, email, name, password } = props;

        if (!id) return ['Falta el id']
        if (email){
            if(!regularExps.email.test(email)) return ['Email is not valid'];
        }
        if (password){
            if(password.length < 6) return ['Password to short'];
        }

        return [undefined, new UpdateUserDtos(id, name, email, password)]
    }
}