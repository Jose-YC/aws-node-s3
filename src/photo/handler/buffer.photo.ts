import { Readable } from "stream";

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  if (Buffer.isBuffer(stream)) return stream;
  
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}