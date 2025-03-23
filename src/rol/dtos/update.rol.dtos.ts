
export class UpdateRolDtos {

    private constructor(
        public readonly name:string,
        public readonly description:string,
    ){}

    get values(){
        const returnObj: {[key:string]: any} = { ':updateAt': new Date().toISOString() }
        if (this.description) returnObj[':description'] = this.description;
        return returnObj;
    }

    get expression(){
        let expression = 'SET #updateAt = :updateAt';
        if (this.description) expression += ', #description = :description';
        return expression;
    }

    get attributeNames(): { [key: string]: string } {
        const names: { [key: string]: any } = {'#updateAt': '_updateAt'};
        if (this.description) names['#description'] = 'description';
        return names;
      }

    static create(props: {[key:string]:any}): [string?, UpdateRolDtos?]{
        const { name, description } = props;

        return [undefined, new UpdateRolDtos(name, description)]
    }
}