import { useEffect, useState } from "react";
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import initialData from "./sample-default.json";
// import initialData from "./d.json";
import testData from "./view.json";

export default function App() {
  const [treeData, setTreeData] = useState(initialData);
  const handleDrop = (newTreeData) => setTreeData(newTreeData);

  // console.log(testData.entityLabelPages[0]);

  const testTree = testData.entityLabelPages[0].labels.map((a, i) => ({
    id: parseInt(
      testData.entityLabelPages[0].entityLongIds[i].toString().substring(9),
      10
    ),
    parent:
      testData.entityLabelPages[0].parentEntityLongIds[i] > 0
        ? parseInt(
            testData.entityLabelPages[0].parentEntityLongIds[i]
              .toString()
              .substring(9),
            10
          )
        : 0,
    text: a,
    droppable: a.includes("element") ? true : false,
  }));
  console.log(testTree, "testree");
  console.log(initialData, "i");

  useEffect(() => {
    setTreeData(testTree);
  }, []);
  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        tree={treeData}
        rootId={0}
        onDrop={handleDrop}
        render={(node, { depth, isOpen, onToggle }) => (
          <div style={{ marginLeft: depth * 10 }}>
            {node.droppable && (
              <span onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</span>
            )}
            {node.text}
          </div>
        )}
      />
    </DndProvider>
  );
}
