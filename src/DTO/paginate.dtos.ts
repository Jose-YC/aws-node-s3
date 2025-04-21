
export class PaginateDtos {

    private constructor(
        public readonly lim:number,
        public readonly startkey?:string,
        public readonly id?:string,
    ){}

    static create(props: {[key:string]:any}): [string?, PaginateDtos?]{ 
        const { lim, startkey, id} = props;
        
        if (!lim || isNaN(Number(lim))|| Number(lim) <= 0) return ['Missing lim'];

        return [undefined, new PaginateDtos(lim, startkey, id)]
    }
}