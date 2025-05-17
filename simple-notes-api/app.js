const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'notes.json');

app.use(express.json());

// Get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// Add a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    const notes = JSON.parse(data || '[]');
    notes.push(newNote);

    fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.status(201).json(newNote);
    });
  });
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const updatedNote = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    let notes = JSON.parse(data || '[]');
    notes = notes.map(note => (note.id === noteId ? updatedNote : note));

    fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update note' });
      }
      res.json(updatedNote);
    });
  });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    const notes = JSON.parse(data || '[]').filter(note => note.id !== noteId);

    fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      res.status(204).end();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
