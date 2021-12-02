import axios from 'axios';
import { streamToBuffer } from '../../utils/stream_to_buffer';
import { Stream } from 'stream';

export class Label {
  private link: string;
  constructor(link: string) {
    if (!link) throw new Error(`Invalid link: ${link}`);
    this.link = link;
  }

  async asBuffer(): Promise<Buffer> {
    const { data } = await axios.get<Stream>(this.link, { responseType: 'stream' });
    return streamToBuffer(data);
  }

  async asAttachement(n: number): Promise<{ filename: string; data: Buffer }> {
    return { filename: `label_${n}.png`, data: await this.asBuffer() };
  }
}
