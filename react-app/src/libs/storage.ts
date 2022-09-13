const STORAGE_NAME = 'storage';

class Storage {
  cache: Map<string, any>;

  constructor() {
    this.cache = this.unpack();
    console.log('Storage:', this.cache);
  }

  unpack(): Map<string, any> {
    try {
      const data = window.localStorage.getItem(STORAGE_NAME) as string;
      return new Map<string, any>(Object.entries(JSON.parse(data)));
    } catch (err) {
      return new Map<string, any>();
    }
  }

  pack(): string {
    return JSON.stringify(Object.fromEntries(this.cache));
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
    window.localStorage.setItem(STORAGE_NAME, this.pack());
  }

  get(key: string, initialValue: any): any {
    try {
      return this.cache.get(key) || initialValue;
    } catch (err) {
      return initialValue;
    }
  }
}

const storage = new Storage();

export default storage;
