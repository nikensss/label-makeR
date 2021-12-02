import { Stream } from 'stream';

export const streamToBuffer = async (stream: Stream): Promise<Buffer> => {
  return new Promise((res, rej) => {
    const chunks: Buffer[] = [];
    stream
      .on('data', data => chunks.push(data))
      .on('end', () => res(Buffer.concat(chunks)))
      .on('errror', rej);
  });
};
