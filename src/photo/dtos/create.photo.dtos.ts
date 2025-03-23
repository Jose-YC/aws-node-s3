export class CreatePhotoDtos {

    private constructor(
        public readonly id:string,
        public readonly url:string,
        public readonly userid:string
    ){}

    static create(props: {[key:string]:any}): [string?, CreatePhotoDtos?]{
        const { id, url, userid } = props;
        if (!id) return ['Missing id'];
        if (!url) return ['Missing name'];
        if (!userid) return ['Missing rol'];
        return [undefined, new CreatePhotoDtos(id, url, userid)] 
    }
}