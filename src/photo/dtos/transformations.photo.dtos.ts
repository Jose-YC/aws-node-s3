import { FiltersPhotoDtos } from "./filters.photo.dtos";
import { NormalisePhotoDtos } from "./normalise.photo.dtos";
import { ResizePhotoDtos } from "./resize.photo.dtos";

export class TransformationsPhotoDtos{

    private constructor(
        public readonly resize?:ResizePhotoDtos,
        public readonly rotate?:number,
        public readonly median?:number,
        public readonly blur?:number,
        public readonly flip?:boolean,
        public readonly flop?:boolean,
        public readonly format?:string,
        public readonly filters?:FiltersPhotoDtos,
        public readonly normalise?:NormalisePhotoDtos,
    ){}


    static create(props: {[key:string]:any}): [string?, TransformationsPhotoDtos?]{
        const { resize, rotate, median, blur, 
                flip, flop, format, filters, normalise } = props;
                
        let flipbool = flip, 
            flopbool = flop;

        if (rotate && isNaN(Number(rotate))) return ['Missing rotate'];
        if (median && isNaN(Number(median))) return ['Missing median'];
        if (blur && isNaN(Number(blur))) return ['Missing blur'];
        if (flip && typeof flip !== 'boolean') flipbool = (flip === 'true');
        if (flop && typeof flop !== 'boolean') flopbool = (flop === 'true');
        
        const [err, resizeDto] =  ResizePhotoDtos.fromObject(resize);
        if (err) return [err];
        const [errnorm, normaliseDtos] =  NormalisePhotoDtos.fromObject(normalise);
        if (errnorm) return [errnorm];
        const filtersDto =  FiltersPhotoDtos.fromObject(filters);

        return  [
            undefined, 
            new TransformationsPhotoDtos(
                resizeDto, rotate, median, 
                blur, flipbool, flopbool, 
                format, filtersDto, normaliseDtos
            )
        ]
        
    }
}