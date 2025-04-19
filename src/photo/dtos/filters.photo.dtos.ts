export class FiltersPhotoDtos {

    private constructor(
        public readonly grayscale?:boolean,
        public readonly negate?:boolean,
        public readonly gamma?:boolean,

    ){}

    static fromObject(props: {[key:string]:any}): FiltersPhotoDtos{
        const { grayscale, negate, gamma } = props;
        let grayscalebool = grayscale, 
            negatebool = negate, 
            gammabool = gamma;

        if (grayscale && typeof grayscale !== 'boolean') grayscalebool = (grayscale === 'true');
        if (negate && typeof negate !== 'boolean') negatebool = (negate === 'true');
        if (gamma && typeof gamma !== 'boolean') gammabool = (gamma === 'true');

        return new FiltersPhotoDtos(grayscale, negate, gamma);
    }
}