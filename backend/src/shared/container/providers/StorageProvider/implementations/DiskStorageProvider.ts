import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    // Verificando se o arquivo existe, stat retorna informações do arquivo
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }
    // forma de deletar o arquivo no node
    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
