class LocalStorageManager {
  private static instance: LocalStorageManager;

  private constructor() {
    if (LocalStorageManager.instance) {
      return LocalStorageManager.instance;
    }

    this.initialize();
    LocalStorageManager.instance = this;
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private initialize(): void {
    if (typeof window !== "undefined" && window.localStorage) {
    }
  }

  public setItem<T>(key: string, value: T): void {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public getItem<T>(key: string): T | null {
    if (typeof window !== "undefined" && window.localStorage) {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  }

  public removeItem(key: string): void {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
}

const localStorageManager = LocalStorageManager.getInstance();
export default localStorageManager;
