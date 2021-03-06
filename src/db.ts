import initialToDos from "./utils/initialToDos.json";
import { toDoItemWithID } from "./components/toDoItemWithID";
import { inputToDoItem } from "./components/inputToDoItem";

const db: toDoItemWithID[] = [...initialToDos.todos]; //array starting with initial to-dos
let idCounter = db.length + 1;

/**
 * Adds in a single item to the database
 *
 * @param data - the item data to insert in
 * @returns the item added (with a newly created id)
 */
export const addToDoItem = (data: inputToDoItem): toDoItemWithID => {
  const today = new Date();
  const newEntry: toDoItemWithID = {
    id: idCounter++,
    title: data.title,
    description: data.description,
    creationDate: today.toISOString(),
    dueDate: data.dueDate,
    completed: false,
  };
  db.push(newEntry);
  return newEntry;
};

/**
 * Deletes a database item with the given id
 *
 * @param id - the id of the database item to delete
 * @returns the deleted database item (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteToDoItemById = (
  id: number
): toDoItemWithID | "not found" => {
  const idxToDeleteAt = findIndexOfToDoItemById(id);
  if (typeof idxToDeleteAt === "number") {
    const itemToDelete = getToDoItemById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return itemToDelete;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a database item with a given id
 *
 * @param id - the id of the database item to locate the index of
 * @returns the index of the matching database item,
 *  otherwise the string `"not found"`
 */
const findIndexOfToDoItemById = (id: number): number | "not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx) {
    return matchingIdx;
  } else {
    return "not found";
  }
};

/**
 * Find all database items
 * @returns all database items from the database
 */
export const getAllDbItems = (): toDoItemWithID[] => {
  return db;
};

/**
 * Locates a database item by a given id
 *
 * @param id - the id of the database item to locate
 * @returns the located database item (if found),
 *  otherwise the string `"not found"`
 */
export const getToDoItemById = (id: number): toDoItemWithID | "not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
  }
};

/**
 * Applies a partial update to a database item for a given id
 *  based on the passed data
 *
 * @param id - the id of the database item to update
 * @param newData - the new data to overwrite
 * @returns the updated database item (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateToDoItemById = (
  id: number,
  newData: Partial<toDoItemWithID>
): toDoItemWithID | "not found" => {
  const idxOfEntry = findIndexOfToDoItemById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "not found";
  }
};
