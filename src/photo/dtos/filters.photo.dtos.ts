export class FiltersPhotoDtos {

    private constructor(
        public readonly grayscale?:boolean,

    ){}

    static fromObject(props: {[key:string]:any}): FiltersPhotoDtos{
        const { grayscale } = props;

        return new FiltersPhotoDtos(grayscale);
    }
}