import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataService {
  private dataPath = path.join(process.cwd(), 'data.json');

  loadData(): any {
    try {
      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    return {
      users: [],
      imoveis: [],
      moradores: [],
      pagamentos: [],
      tokens: {}
    };
  }

  saveData(data: any): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }
}