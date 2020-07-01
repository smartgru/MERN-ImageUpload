import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reoder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 10;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 380,
});

const ImageList = ({ images, onRemoveImage, onReorder }) => {
  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    setImgList(images);
  }, [images]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = reoder(
      imgList,
      result.source.index,
      result.destination.index,
    );
    setImgList(items);
    await onReorder(result.source.index, result.destination.index);
  };

  return (
    <div className="image-container">
      <h2>Image List</h2>
      {imgList.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {imgList.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="image-card"
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                      >
                        <img src={image.src} alt={image.name} />
                        <span>{image.name}</span>
                        <div
                          className="btn-remove"
                          onClick={(event) =>
                            onRemoveImage(event, index, image.id)
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default ImageList;
