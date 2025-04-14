export class NormalisePhotoDtos {

    private constructor(
        public readonly lower?:number,
        public readonly upper?:number
    ){}

    static fromObject(props: {[key:string]:any}): NormalisePhotoDtos{
        const { lower, upper } = props;

        return new NormalisePhotoDtos(lower, upper);
    }
}