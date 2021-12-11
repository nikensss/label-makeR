import { storage } from 'firebase-admin';
import { config } from '../../config/config';

export class Label {
  private path: string;
  constructor(path: string) {
    if (!path) throw new Error(`Invalid link: ${path}`);
    this.path = path;
  }

  async asBuffer(): Promise<Buffer> {
    const file = storage().bucket(config.storage.bucket).file(this.path);
    const isEmulators = process.env.FUNCTIONS_EMULATOR === 'true';
    const [buffer] = await file.download({ validation: !isEmulators });
    return buffer;
  }

  async asMailgunAttachement(n: number): Promise<{ filename: string; data: Buffer }> {
    return { filename: `label_${n}.png`, data: await this.asBuffer() };
  }
}
