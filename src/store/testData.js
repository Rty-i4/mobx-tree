import { getDescendants } from "@minoru/react-dnd-treeview";
import { makeAutoObservable, runInAction, toJS } from "mobx";

class TestData {
  items = [
    {
      id: 1,
      parent: 0,
      droppable: true,
      text: "Folder 1",
    },
    {
      id: 2,
      parent: 1,
      text: "File 1-1",
    },
    {
      id: 3,
      parent: 1,
      text: "File 1-2",
    },
    {
      id: 4,
      parent: 0,
      droppable: true,
      text: "Folder 2",
    },
    {
      id: 5,
      parent: 4,
      droppable: true,
      text: "Folder 2-1",
    },
    {
      id: 6,
      parent: 5,
      text: "File 2-1-1",
    },
  ];
  state = "loading";
  constructor() {
    makeAutoObservable(this);
  }

  async fetchData() {
    this.items = [];
    this.state = "loading";
    try {
      const res = await fetch(
        "https://api.github.com/gists/e1702c1ef26cddd006da989aa47d4f62"
      );
      const result = await res.json();
      const content = JSON.parse(result.files[`view.json`].content);

      const testTree = content.entityLabelPages[0].labels.map((a, i) => ({
        id: parseInt(
          content.entityLabelPages[0].entityLongIds[i].toString().substring(9),
          10
        ),
        parent:
          content.entityLabelPages[0].parentEntityLongIds[i] > 0
            ? parseInt(
                content.entityLabelPages[0].parentEntityLongIds[i]
                  .toString()
                  .substring(9),
                10
              )
            : 0,
        text: a,
        droppable: a.includes("element") ? true : false,
        longId: content.entityLabelPages[0].entityLongIds[i],
        parentLongId: content.entityLabelPages[0].parentEntityLongIds[i],
      }));
      runInAction(() => {
        this.items = testTree;
        this.state = "done";
      });
    } catch (e) {
      runInAction(() => {
        this.state = "error";
        console.log(e);
      });
    }
  }

  remove(id) {
    const deleteIds = [
      id,
      ...getDescendants(this.items, id).map((node) => node.id),
    ];
    const newTree = this.items.filter((node) => !deleteIds.includes(node.id));

    this.items = newTree;
  }

  apply() {
    console.log(toJS(this.items));
  }

  handleDrop(newData) {
    // const n = newData.map((a) => ({ ...a }));

    this.items = newData;
  }
}
export default new TestData();
