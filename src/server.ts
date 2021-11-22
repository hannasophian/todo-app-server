import express from "express";
import cors from "cors";
import {
  getAllDbItems,
  addToDoItem,
  deleteToDoItemById,
  updateToDoItemById,
  getToDoItemById,
} from "./db";
import { inputToDoItem } from "./components/inputToDoItem";
// import dotenv from "dotenv";
// import {
//   addDummyDbItems,
//   addDbItem,
//   getAllDbItems,
//   getDbItemById,
//   DbItem,
//   updateDbItemById,
// } from "./db";
import filePath from "./filePath";
import { toDoItemWithID } from "./components/toDoItemWithID";

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
// dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /items
app.get("/todos", (req, res) => {
  const allToDos = getAllDbItems();
  res.status(200).json(allToDos);
});

app.get("/todos/:id", (req, res) => {
  const singleToDo = getToDoItemById(parseInt(req.params.id));
  res.status(200).json(singleToDo)
})

// POST /items
app.post<{}, {}, inputToDoItem>("/todos", (req, res) => {
  // to be rigorous, ought to handle non-conforming request bodies
  // ... but omitting this as a simplification
  const postData = req.body;
  const createdToDo = addToDoItem(postData);
  res.status(201).json(createdToDo);
});

// // GET /items/:id
// app.get<{ id: string }>("/items/:id", (req, res) => {
//   const matchingSignature = getDbItemById(parseInt(req.params.id));
//   if (matchingSignature === "not found") {
//     res.status(404).json(matchingSignature);
//   } else {
//     res.status(200).json(matchingSignature);
//   }
// });

// DELETE /items/:id
app.delete<{ id: string }>("/todos/:id", (req, res) => {
  const matchingSignature = deleteToDoItemById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

// PATCH /items/:id
app.patch<{ id: string }, {}, Partial<toDoItemWithID>>(
  "/todos/:id",
  (req, res) => {
    const matchingSignature = updateToDoItemById(
      parseInt(req.params.id),
      req.body
    );
    if (matchingSignature === "not found") {
      res.status(404).json(matchingSignature);
    } else {
      res.status(200).json(matchingSignature);
    }
  }
);

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
