import { LobbyData, LobbyStorage } from "@/types/lobby";

class LocalLobbyStorage implements LobbyStorage {
  private storage: Map<string, LobbyData>;

  constructor() {
    this.storage = new Map();
  }

  get(key: string): LobbyData | undefined {
    return this.storage.get(key);
  }

  set(key: string, value: LobbyData): void {
    this.storage.set(key, value);
  }

  delete(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  getAll(): Map<string, LobbyData> {
    return new Map(this.storage);
  }
}

export const lobbyStorage = new LocalLobbyStorage();