export default class State {
  constructor() {
    this.storageName = 'trello-state';
  }

  save(data) {
    localStorage.setItem(this.storageName, JSON.stringify(data));
  }

  load() {
    const json = localStorage.getItem(this.storageName);
    try {
      return json ? JSON.parse(json) : null;
    } catch (e) {
      return null;
    }
  }
}