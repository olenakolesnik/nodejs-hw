import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    throw createHttpError(404, `Note with ID: ${noteId} not found`);
  }
  res.status(200).json(note);
};

export const createNote = async(req, res) => {
 const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findOneAndDelete({ _id: noteId });
  if (!deletedNote) {
    throw createHttpError(404, `Note with ID: ${noteId} not found`);
  }
  res.status(200).json({ message: `Note with ID: ${noteId} deleted successfully` });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findOneAndUpdate({ _id: noteId }, req.body, { new: true });
  if (!updatedNote) {
    throw createHttpError(404, `Note with ID: ${noteId} not found`);
  }
  res.status(200).json(updatedNote);
};
