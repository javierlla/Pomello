import { useState, useEffect, useRef } from "react";
import ShowTasks from "../task/showTasks.jsx";
import NewTask from "../task/NewTask.jsx";
import { removeList, updateList, updateListPositions } from "../../utils/list.js";
import { useRevalidator } from "react-router-dom";
import { DragableList } from "./DragableList.jsx";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

/**
 * Component to show a list of lists and their tasks.
 * Handles deleting a list and updating the order of lists.
 * @param {Object[]} lists - The list of lists to be displayed.
 * @param {Function} onAddTask - Callback to handle adding a new task.
 * @returns {JSX.Element} The rendered component.
 */
function ShowLists({ lists: initialLists, onAddTask }) {
  const [lists, setLists] = useState([]);
  const [isReady, setIsReady] = useState(false); // Estado para controlar el renderizado
  const [setError] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const revalidator = useRevalidator();

  const [editingListId, setEditingListId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    const sortedLists = [...initialLists].sort((a, b) => a.position - b.position);
    setLists(sortedLists);
    setIsReady(true); // Marcar como listo para renderizar
  }, [initialLists]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [editedTitle, editingListId]);

  /**
   * Handles the removal of a list.
   * Removes the list with the given ID from the state and calls the removeList
   * function to send the removal request to the backend. If the selected list is
   * the one being removed, it resets the selected list to null. Then, it
   * revalidates the route. If there is an error, it sets an error message in the
   * state.
   * @param {string} listId - The ID of the list to be removed.
   * @returns {Promise<void>} Resolves when the list is removed and the route is revalidated.
   */
  const handleRemoveList = async (listId) => {
    try {
      const result = await removeList(listId);
      if (result.error) {
        setError(`Error removing list: ${result.error}`);
      } else {
        setLists((prevLists) =>
          prevLists.filter((list) => list._id !== listId)
        );
        if (selectedList && listId === selectedList._id) {
          setSelectedList(null);
        }
        revalidator.revalidate();
      }
    } catch (error) {
      setError(`Error removing list: ${error.message}`);
    }
    setListToDelete(null);
  };

  /**
   * Saves the edited title for the list with the given ID.
   * Updates the edited title in the state and calls the updateList function
   * to send the new title to the backend. Then, it revalidates the route.
   * @param {string} listId - The ID of the list to be saved.
   * @returns {Promise<void>} Resolves when the list title is updated and the route is revalidated.
   */
  const handleTitleSave = async (listId) => {
    await updateList(listId, { title: editedTitle });
    setEditingListId(null);
    revalidator.revalidate();
  };

  const sensors = useSensors(useSensor(PointerSensor));

/**
 * Handles the drag-and-drop end event for reordering lists.
 * Updates the order of lists based on the drag operation and
 * sends the new list positions to the backend.
 *
 * @param {Object} event - The event object from the drag-and-drop interaction.
 * @param {Object} event.active - The currently dragged item.
 * @param {Object} event.over - The item over which the dragged item is currently positioned.
 */

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = lists.findIndex((list) => list._id === active.id);
      const newIndex = lists.findIndex((list) => list._id === over.id);

      const newOrder = arrayMove(lists, oldIndex, newIndex);
      setLists(newOrder);

      // Enviar las nuevas posiciones al backend
      const updatedLists = newOrder.map((list, index) => ({
        _id: list._id,
        position: index,
      }));

      try {
        await updateListPositions(updatedLists);
      } catch (error) {
        console.error("Error updating list positions:", error);
      }
    }
  };

  if (!isReady) {
    return null; // No renderizar nada hasta que las listas estén listas
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lists.map((l) => l._id)}
          strategy={verticalListSortingStrategy}
        >
          {lists.map((list) => (
            <DragableList
              key={list._id}
              list={list}
              onAddTask={onAddTask}
              setListToDelete={setListToDelete}
              editingListId={editingListId}
              setEditingListId={setEditingListId}
              editedTitle={editedTitle}
              setEditedTitle={setEditedTitle}
              handleTitleSave={handleTitleSave}
              textareaRef={textareaRef}
            />
          ))}
        </SortableContext>
      </DndContext>

      {listToDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setListToDelete(null)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the list{" "}
              <strong>{listToDelete.title}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setListToDelete(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveList(listToDelete._id)}
                className="bg-[#f56b79] text-white px-4 py-2 rounded-lg hover:brightness-90 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowLists;
