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
        public readonly filters?:FiltersPhotoDtos,
        public readonly normalise?:NormalisePhotoDtos,
    ){}

    get values(): { [key: string]: string } {
        const transformations: { [key: string]: any } = {};
        if (this.resize) transformations.resize = this.resize;
        if (this.rotate) transformations.rotate = this.rotate;
        if (this.median) transformations.median = this.median;
        if (this.blur) transformations.blur = this.blur;
        if (this.flip) transformations.flip = this.flip;
        if (this.flop) transformations.flop = this.flop;
        if (this.filters) transformations.filters = this.filters;
        if (this.normalise) transformations.normalise = this.normalise;
        return transformations;
      }

    static create(props: {[key:string]:any}): [string?, TransformationsPhotoDtos?]{
        const { resize, rotate, median, blur, 
                flip, flop, filters, normalise } = props;
                
        let flipbool = flip, 
            flopbool = flop, 
            resizeDto:ResizePhotoDtos|undefined, 
            normaliseDto:NormalisePhotoDtos|undefined, 
            filtersDto:FiltersPhotoDtos|undefined;

        if (rotate && isNaN(Number(rotate))) return ['Missing rotate'];
        if (median && isNaN(Number(median))) return ['Missing median'];
        if (blur && isNaN(Number(blur))) return ['Missing blur'];
        if (flip && typeof flip !== 'boolean') flipbool = (flip === 'true');
        if (flop && typeof flop !== 'boolean') flopbool = (flop === 'true');
        
        if (resize) {
            const [err, datosResize] =  ResizePhotoDtos.fromObject(resize);
            if (err) return [err];
            resizeDto = datosResize;
        }

        if (normalise) {
            const [error, datosNormalise] =  NormalisePhotoDtos.fromObject(normalise);
            if (error) return [error];
            normaliseDto = datosNormalise;
        }
        
        if (filters) filtersDto =  FiltersPhotoDtos.fromObject(filters);
        

        return  [
            undefined, 
            new TransformationsPhotoDtos(
                resizeDto, rotate, median, 
                blur, flipbool, flopbool, 
                filtersDto, normaliseDto
            )
        ]
        
    }
}