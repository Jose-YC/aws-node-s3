export class CropPhotoDtos {

    private constructor(
        public readonly width?:number,
        public readonly height?:number,
        public readonly x?:number,
        public readonly y?:number
    ){}

    static fromObject(props: {[key:string]:any}): CropPhotoDtos{
        const { width, height, x, y } = props;

        return new CropPhotoDtos(width, height, x, y);
    }
}