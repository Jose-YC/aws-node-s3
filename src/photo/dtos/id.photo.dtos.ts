export class PhotoIdDtos {

    private constructor(
        public readonly userid:string,
        public readonly photoid:string
    ){}

    static create(props: {[key:string]:any}): [string?, PhotoIdDtos?]{
        const { userid, photoid } = props;
        if (!photoid) return ['Missing photoid'];
        if (!userid) return ['Missing userid'];
        return [undefined, new PhotoIdDtos( userid, photoid)] 
    }
}