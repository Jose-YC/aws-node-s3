export class ResizePhotoDtos {

    private constructor(
        public readonly width?:string,
        public readonly height?:string
    ){}

    static fromObject(props: {[key:string]:any}): ResizePhotoDtos{
        const { width, height } = props;

        return new ResizePhotoDtos(width, height)
    }
}