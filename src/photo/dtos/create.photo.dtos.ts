export class CreatePhotoDtos {

    private constructor(
        public readonly id:string,
        public readonly url:string,
        public readonly type:string,
        public readonly userid:string
    ){}

    static create(props: {[key:string]:any}): [string?, CreatePhotoDtos?]{
        const { id, url, type ,userid } = props;
        if (!id) return ['Missing id'];
        if (!url) return ['Missing url'];
        if (!type) return ['Missing type'];
        if (!userid) return ['Missing user id'];
        return [undefined, new CreatePhotoDtos(id, url, type, userid)] 
    }
}