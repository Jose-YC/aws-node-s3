
export class UpdateRolDtos {

    private constructor(
        public readonly name:string,
    ){}

    get values(){
        const returnObj: {[key:string]: any} = { ':updateAt': new Date().toISOString() }
        if (this.name) returnObj[':name'] = this.name;
        return returnObj;
    }

    get expression(){
        let expression = 'SET _updateAt = :updateAt';
        if (this.name) expression += ', #name = :name';
        return expression;
    }

    get attributeNames(): { [key: string]: string } {
        const names: { [key: string]: any } = {};
        if (this.name) names['#name'] = 'name';
        return names;
      }

    static create(props: {[key:string]:any}): [string?, UpdateRolDtos?]{
        const { name } = props;

        return [undefined, new UpdateRolDtos(name)]
    }
}