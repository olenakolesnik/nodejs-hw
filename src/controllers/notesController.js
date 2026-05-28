import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page, perPage, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const limit = perPage;

  const notesQuery = Note.find({
    userId: req.user._id,
  });
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    });
  }


  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

const [totalNotes, notes] = await Promise.all([
  notesQuery.clone().countDocuments(),
  notesQuery.skip(skip).limit(limit),
]);

  const totalPages = Math.ceil(totalNotes / limit);
  res.status(200).json({
    page,
    perPage,
    totalPages,
    totalNotes,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!note) {
    throw createHttpError(404, `Note not found`);
  }
  res.status(200).json(note);
};

export const createNote = async(req, res) => {
 const newNote = await Note.create({...req.body, userId: req.user._id});
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });
  if (!deletedNote) {
    throw createHttpError(404, `Note not found`);
  }
  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findOneAndUpdate({ _id: noteId, userId: req.user._id }, req.body, { returnDocument: 'after' });
  if (!updatedNote) {
    throw createHttpError(404, `Note not found`);
  }
  res.status(200).json(updatedNote);
};
