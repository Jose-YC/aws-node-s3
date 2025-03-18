
export class CreateRolDtos {

    private constructor(
        public readonly id:string,
        public readonly name:string,
    ){}

    static create(props: {[key:string]:any}): [string?, CreateRolDtos?]{
        const { name, id} = props;
        if (!id) return ['Missing name'];
        if (!name) return ['Missing name'];
        return [undefined, new CreateRolDtos(id, name)]
    }
}