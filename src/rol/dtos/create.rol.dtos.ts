
export class CreateRolDtos {

    private constructor(
        public readonly name:string,
        public readonly description:string,
    ){}

    static create(props: {[key:string]:any}): [string?, CreateRolDtos?]{
        const { name, description} = props;
        if (!description) return ['Missing name'];
        if (!name) return ['Missing name'];
        return [undefined, new CreateRolDtos(name, description)]
    }
}