
export class UpdateRolDtos {

    private constructor(
        public readonly id:number,
        public readonly name:string,
    ){}

    get values(){
        const returnObj: {[key:string]: any}={}
        if (this.name) returnObj.name=this.name;
        return returnObj;
    }

    static create(props: {[key:string]:any}): [string?, UpdateRolDtos?]{
        const {id,name} = props;
        if (!name) ['Missing email'];
        if (!id|| isNaN(Number(id))) ['Missing id'];
        return [undefined, new UpdateRolDtos(id, name)]
    }
}