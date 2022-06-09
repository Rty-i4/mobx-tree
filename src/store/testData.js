import { makeAutoObservable } from "mobx";

class TestData {
  data = [];
  constructor() {
    makeAutoObservable(this);
  }

  fetchData() {
    this.data = [1, 2, 4];
  }

  delete() {}

  remove() {}

  apply() {}

  select()

  returnNew() {}
}
export default new TestData();
