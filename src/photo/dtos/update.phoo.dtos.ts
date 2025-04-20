import { PhotoIdDtos } from "./id.photo.dtos";
import { TransformationsPhotoDtos } from "./transformations.photo.dtos";

export class PhotoDtos {

    private constructor(
        public readonly ids:PhotoIdDtos,
        public readonly transformations:TransformationsPhotoDtos
    ){}

    static create(props: {[key:string]:any}): [string?, PhotoDtos?]{
        const { ids, photoid } = props;
        const [err, idDto] =  PhotoIdDtos.create(ids);
        if (err) return [err];
        const [error, transformationsDto] =  TransformationsPhotoDtos.create(photoid);
        if (error) return [error];
        return [undefined, new PhotoDtos( idDto!, transformationsDto!)] 
    }
}