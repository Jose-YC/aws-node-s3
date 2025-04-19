import sharp from "sharp";
import { TransformationsPhotoDtos } from "../dtos/transformations.photo.dtos";

export class PhotoTransformer {
    private image: sharp.Sharp;
    private readonly transformers: Record<string, (options: any) => sharp.Sharp>;
    private readonly filter: Record<string, (options: any) => sharp.Sharp>;
    
    constructor(imageBuffer: Buffer) {
      this.image = sharp(imageBuffer);
      this.transformers = this.transformations();
      this.filter = this.filters();
    }

    private transformations(): Record<string, ( options: any) => sharp.Sharp> {
      return {
        rotate: (option) => this.image.rotate(option),
        flip: (enabled) => enabled ? this.image.flip() : this.image,
        flop: (enabled) => enabled ? this.image.flop() : this.image,
        resize: (params) => this.image.resize(params),
        blur: (sigma) => this.image.blur(sigma),
        normalise: (options) => this.image.normalise(options),
        median: (size) => this.image.median(size),
        format: (format) => this.image.toFormat(format)
      }
    };

    private filters(): Record<string, (options: any) => sharp.Sharp> {
      return {
        grayscale: (option) => option ? this.image.grayscale() : this.image,
        negate: (option) => option ? this.image.negate() : this.image,
        gamma: (options) => options ? this.image.gamma(options) : this.image,
        tint: (options) => options ? this.image.tint(options) : this.image
      }
    };

    async applyTransformations( transformations ): Promise<this> {
      if (!transformations) return this;

      Object.entries(transformations).forEach(([name, option]) => {
        if (name in this.transformers) this.image = this.transformers[name](option);
      });

      return this; 
    }

    async applyFilters( filters ): Promise<this> {
      if (!filters) return this;

      Object.entries(filters).forEach(([name, option]) => {
        if (name in this.filter) this.image = this.filter[name](option);
      });

      return this; 
    }

    async applyAll( alltransfor: TransformationsPhotoDtos ): Promise<this> {
      if (!alltransfor) return this;

      await this.applyTransformations(alltransfor);
      
      if (alltransfor.filters) await this.applyFilters(alltransfor.filters);
      
      return this;
    }
  
    async getBuffer(): Promise<Buffer> {
      return await this.image.toBuffer();
    }
    
  }

