import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
  getDescendants,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { theme } from "./theme";
import styles from "./App.module.css";
import testData from "./view.json";

export default function App() {
  const [treeData, setTreeData] = useState([]);
  const handleDrop = (newTreeData) => setTreeData(newTreeData);
  const [selectedNode, setSelectedNode] = useState(null);
  const handleSelect = (node) => setSelectedNode(node);

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
    longId: testData.entityLabelPages[0].entityLongIds[i],
    parentLongId: testData.entityLabelPages[0].parentEntityLongIds[i],
  }));
  // console.log(testTree, "testree");
  const handleDelete = (id) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id),
    ];
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id));

    setTreeData(newTree);
  };

  useEffect(() => {
    setTreeData(testTree);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <div className={styles.tree}>
            <Tree
              tree={treeData}
              rootId={0}
              render={(node, { depth, isOpen, onToggle }) => (
                <CustomNode
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  isSelected={node.id === selectedNode?.id}
                  onToggle={onToggle}
                  onSelect={handleSelect}
                />
              )}
              dragPreviewRender={(monitorProps) => (
                <CustomDragPreview monitorProps={monitorProps} />
              )}
              onDrop={handleDrop}
              classes={{
                draggingSource: styles.draggingSource,
                dropTarget: styles.dropTarget,
              }}
            />
          </div>
          <div>
            <div className={styles.current}>
              Выбранный элемент:
              {selectedNode && (
                <div>
                  <p className={styles.currentLabel}>
                    Label: {selectedNode ? selectedNode.text : "none"}{" "}
                  </p>
                  <p className={styles.currentLabel}>
                    Id: {selectedNode ? selectedNode.longId : "none"}
                  </p>
                  <p className={styles.currentLabel}>
                    ParentId:{" "}
                    {selectedNode ? selectedNode.parentLongId : "none"}
                  </p>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                padding: 20,
                background: "lightblue",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div>Refresh</div>
              <div onClick={() => console.log(treeData)}>Apply</div>
              <div onClick={() => handleDelete(selectedNode.id)}>Delete</div>
            </div>
          </div>
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}
