import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { theme } from "./theme";
import styles from "./App.module.css";
import { observer } from "mobx-react-lite";
import testData from "./store/testData";
import { Placeholder } from "./Placeholder";

const App = observer(() => {
  const [treeData, setTreeData] = useState([]);
  const handleDrop = (newTreeData) => setTreeData(newTreeData);
  const [selectedNode, setSelectedNode] = useState(null);
  const handleSelect = (node) => setSelectedNode(node);

  useEffect(() => {
    testData.handleDrop(treeData);
  }, [treeData]);
  useEffect(() => {
    testData.fetchData();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <div className={styles.tree}>
            <Tree
              tree={testData.items}
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
                placeholder: styles.placeholderContainer,
              }}
              sort={false}
              insertDroppableFirst={false}
              canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
                if (dragSource?.parent === dropTargetId) {
                  return true;
                }
              }}
              dropTargetOffset={5}
              placeholderRender={(node, { depth }) => (
                <Placeholder node={node} depth={depth} />
              )}
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

                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                className={styles.button}
                onClick={() => testData.fetchData()}
              >
                Refresh
              </div>
              <div className={styles.button} onClick={() => testData.apply()}>
                Apply
              </div>
              <div
                className={styles.button}
                onClick={() => testData.remove(selectedNode.id)}
              >
                Delete
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </ThemeProvider>
  );
});

export default App;
