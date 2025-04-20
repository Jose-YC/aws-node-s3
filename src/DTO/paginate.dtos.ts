
export class PaginateDtos {

    private constructor(
        public readonly lim:number,
        public readonly startkey?:string,
        public readonly id?:string,
    ){}

    static create(props: {[key:string]:any}): [string?, PaginateDtos?]{
        const { lim, startkey, id} = props;
        if (!startkey) return ['Missing name'];
        if (!lim || isNaN(Number(lim))) return ['Missing lim'];

        return [undefined, new PaginateDtos(lim, startkey, id)]
    }
}