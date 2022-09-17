class Storage {
  cache: Map<string, any>;

  constructor() {
    this.cache = new Map<string, any>();
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
    window.localStorage.setItem(key, value);
  }

  get(key: string, initialValue: any): any {
    try {
      return this.cache.get(key) || window.localStorage.getItem(key) || initialValue;
    } catch (err) {
      return initialValue;
    }
  }

  clear(): void {
    window.localStorage.clear();
    this.cache.clear();
  }

  remove(key: string): boolean {
    window.localStorage.removeItem(key);
    return this.cache.delete(key);
  }
}

const storage = new Storage();

export default storage;
