export class ResizePhotoDtos {

    private constructor(
        public readonly width?:number,
        public readonly height?:number,
        public readonly fit?:string
    ){}

    static fromObject(props: {[key:string]:any}): [string?, ResizePhotoDtos?]{
        const { width, height, fit } = props;
        if (width && isNaN(Number(width))) return ['Missing width'];
        if (height && isNaN(Number(height))) return ['Missing height'];

        return [ undefined, new ResizePhotoDtos(width, height, fit)];
    }
}