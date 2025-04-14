import { CropPhotoDtos } from "./crop.photo.dtos";
import { FiltersPhotoDtos } from "./filters.photo.dtos";
import { NormalisePhotoDtos } from "./normalise.photo.dtos";
import { ResizePhotoDtos } from "./resize.photo.dtos";

export class TransformationsPhotoDtos {

    private constructor(
        public readonly resize?:ResizePhotoDtos,
        public readonly crop?:CropPhotoDtos,
        public readonly rotate?:number,
        public readonly median?:number,
        public readonly blur?:number,
        public readonly flip?:boolean,
        public readonly flop?:boolean,
        public readonly format?:string,
        public readonly filters?:FiltersPhotoDtos,
        public readonly normalise?:NormalisePhotoDtos,
    ){}

    // get order(){
    //     const returnObj: {[key:string]: any} = {}
    //     if (this.crop) returnObj.crop = this.crop;
    //     if (this.rotate) returnObj.rotate = this.rotate;
    //     if (this.flip) returnObj.flip = this.flip;
    //     if (this.flop) returnObj.flop = this.flop;
    //     if (this.resize) returnObj.resize = this.resize;
    //     if (this.blur) returnObj.blur = this.blur;
    //     if (this.normalise) returnObj.normalise = this.normalise;
    //     if (this.filters) returnObj.filters = this.filters;
    //     if (this.median) returnObj.median = this.median;
    //     if (this.format) returnObj.format = this.format;
    //     return returnObj;
    // }

    static create(props: {[key:string]:any}): TransformationsPhotoDtos{
        const { resize, crop, rotate, median, blur, 
                flip, flop, format, filters, normalise } = props;

        const resizeDto =  ResizePhotoDtos.fromObject(resize);
        const cropDto =  CropPhotoDtos.fromObject(crop);
        const filtersDto =  FiltersPhotoDtos.fromObject(filters);
        const normaliseDtos =  NormalisePhotoDtos.fromObject(normalise);

        console.log("AQUI VA TODAS LAS ENTIDADES PARA TRANSFORMAR: ", resizeDto, cropDto, filtersDto, normaliseDtos);

        return  new TransformationsPhotoDtos(
                resizeDto, cropDto, rotate, median, 
                blur, flip, flop, format, filtersDto, 
                normaliseDtos
            )
        
    }
}