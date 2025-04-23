export class PhotoEntity {

    constructor(
        public readonly id:string,
        public readonly url:string,
        public readonly type:string,
        public readonly userid:string
    ){}

    static fromObject= (object:{[key:string]:any} ):PhotoEntity => {
        const { id, url, type, userid } = object;

        if (!id) console.log('id not exist');
        if (!url) console.log('url not exist');
        if (!type) console.log('type not exist');
        if (!userid) console.log('userid not exist');
        return new PhotoEntity(id, url, type, userid);
    }
}