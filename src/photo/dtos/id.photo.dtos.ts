export class PhotoIdDtos {

    private constructor(
        public readonly userid:string,
        public readonly photoid:string
    ){}

    static create(props: {[key:string]:any}): [string?, PhotoIdDtos?]{
        const { userid, photoid } = props;
        if (!photoid) return ['Missing name'];
        if (!userid) return ['Missing rol'];
        return [undefined, new PhotoIdDtos( userid, photoid)] 
    }
}