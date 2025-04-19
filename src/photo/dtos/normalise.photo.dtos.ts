export class NormalisePhotoDtos {

    private constructor(
        public readonly lower?:number,
        public readonly upper?:number
    ){}

    static fromObject(props: {[key:string]:any}): [string?, NormalisePhotoDtos?]{
        const { lower, upper } = props;
        if (lower && isNaN(Number(lower))) return ['Missing lower'];
        if (upper && isNaN(Number(upper))) return ['Missing upper'];

        return [ undefined, new NormalisePhotoDtos(lower, upper)];
    }
}