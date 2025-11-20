const path = require('path');
const Dir = path.join(__dirname, 'data');
const notesDir = path.join(Dir, 'contents');

// === Notes ===
const fs = require('fs');
const matter = require('gray-matter');

// Get all folders in the notesDir 
function getNotes() {
  const notes = [];
  const folders = fs.readdirSync(notesDir);
  folders.forEach(folder => {
    const folderPath = path.join(notesDir, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      notes.push(folder);
    }
  });
  return notes;
}

function getNoteMetadata(name) {
  const notePath = path.join(notesDir, name, 'note.md');
  if (fs.existsSync(notePath)) {
    const content = fs.readFileSync(notePath, 'utf-8');
    const { data: metadata } = matter(content);
    return metadata;
  } else {
    return null;
  }
}

function getNoteContent(name) {
  const notePath = path.join(notesDir, name, 'note.md');
  if (fs.existsSync(notePath)) {
    const content = fs.readFileSync(notePath, 'utf-8');
    const { content: noteContent } = matter(content);
    return noteContent;
  } else {
    return null;
  }
}

// === Express Server ===
const express = require('express');
const app = express();
const port = 1135;

app.use(express.json());
app.use('/', express.static(Dir));

app.get('/', (req, res) => {
  res.sendFile(path.join(Dir, 'index.html'));
});

app.get('/api/notes', (req, res) => {
  const notes = getNotes().map(name => {
    const metadata = getNoteMetadata(name);
    return { name, metadata };
  });

  res.json({ success: true, data: notes });
});

app.get('/api/notes/:name', (req, res) => {
  const name = req.params.name;
  const metadata = getNoteMetadata(name);
  const content = getNoteContent(name);

  if (metadata && content) res.json({ success: true, data: { name, metadata, content } });
  else res.status(404).json({ success: false, error: 'Note not found' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
