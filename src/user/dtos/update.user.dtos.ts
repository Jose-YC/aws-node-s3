export class UpdateUserDtos {

    private constructor(
        public readonly id:string,
        public readonly name?:string,
        public password?:string, 
    ){}

    get values(){
        const returnObj: {[key:string]: any} = { ':updateAt': new Date().toISOString() }
        if (this.name) returnObj[':name'] = this.name;
        if (this.password) returnObj[':password'] = this.password;
        return returnObj;
    }

    get expression(){
        let expression = 'SET _updateAt = :updateAt';
        if (this.name) expression += ', #name = :name';
        if (this.password) expression += ', #password = :password';
        return expression;
    }

    get attributeNames(): { [key: string]: string } {
        const names: { [key: string]: any } = {};
        
        if (this.name) names['#name'] = 'name';
        if (this.password) names['#password'] = 'password';
        
        return names;
      }

    static create(props: {[key:string]:any}): [string?, UpdateUserDtos?]{
        const { id, name, password } = props;

        if (!id) return ['Falta el id'];
        if(password && password.length < 6) return ['Password to short'];

        return [undefined, new UpdateUserDtos(id, name, password)]
    }
}