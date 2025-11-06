function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    const clockElement = document.getElementById('top-clock');
    clockElement.innerHTML = `${hours}<span style="opacity:${Number(now.getSeconds() % 2 === 0)}">:</span>${minutes}`;
}

function getNotes() {
    return fetch('/api/notes')
        .then(response => response.json())
        .then(data => data.success ? data.data : []);
} 

function generateNoteCards() {
    getNotes().then(notes => {
        const notesContainer = document.getElementById('notes-container');
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-item';
            card.innerHTML = `
                <img src="./contents/${note.name}/thumbnail.jpg">
                <div class="note-item-topic">${note.metadata.topic || 'No topic available.'}</div>
                <div class="note-item-title">${note.metadata.title || note.name}</div>
                <div class="note-item-tags">${(note.metadata.tags || []).join(', ')}</div>
            `;
            card.onclick = () => {
                console.log(`Clicked on note: ${note.name}`);
                // You can add navigation to the note detail page here
            }
            notesContainer.appendChild(card);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    generateNoteCards();
    updateClock(); 
    setInterval(updateClock, 1000);
});
