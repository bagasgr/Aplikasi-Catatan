// Komponen Header
class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: #6200ea;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    font-size: 1.5em;
                    font-weight: bold;
                }
            </style>
            <header>📌 Aplikasi Catatan</header>
        `;
    }
}
customElements.define('app-header', AppHeader);

// Komponen Item Catatan
class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set noteData(note) {
        this.note = note;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .note-item {
                    background: white;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                h2 { margin: 0; font-size: 1.2em; }
                p { font-size: 0.9em; color: #555; }
                small { color: gray; }
                button {
                    background-color: red;
                    color: white;
                    border: none;
                    padding: 5px;
                    cursor: pointer;
                    border-radius: 3px;
                    align-self: flex-end;
                }
                button:hover {
                    background-color: darkred;
                }
            </style>
            <div class="note-item">
                <h2>${this.note.title}</h2>
                <p>${this.note.body}</p>
                <small>${this.note.createdAt}</small>
                <button id="deleteBtn">Hapus</button>
            </div>
        `;

        this.shadowRoot.getElementById('deleteBtn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-note', {
                detail: this.note.id,
                bubbles: true,
                composed: true
            }));
        });
    }
}
customElements.define('note-item', NoteItem);

// Komponen Daftar Catatan
class NoteList extends HTMLElement {
    constructor() {
        super();
        this.notes = [];
    }

    set notesData(notes) {
        this.notes = notes;
        this.render();
    }

    connectedCallback() {
        this.render();
        this.addEventListener('delete-note', (event) => {
            this.notes = this.notes.filter(note => note.id !== event.detail);
            this.render();
        });
    }

    render() {
        this.innerHTML = '';
        this.notes.forEach(note => {
            const noteElement = document.createElement('note-item');
            noteElement.noteData = note;
            this.appendChild(noteElement);
        });
    }
}
customElements.define('note-list', NoteList);

// Komponen Formulir Catatan
class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.getElementById('noteForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const title = this.shadowRoot.getElementById('title').value;
            const body = this.shadowRoot.getElementById('body').value;

            if (title && body) {
                this.dispatchEvent(new CustomEvent('add-note', {
                    detail: { title, body },
                    bubbles: true,
                    composed: true
                }));
                this.shadowRoot.getElementById('noteForm').reset();
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 10px;
                }
                input, textarea {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                button {
                    background: #6200ea;
                    color: white;
                    border: none;
                    padding: 8px;
                    cursor: pointer;
                    border-radius: 5px;
                }
                button:hover {
                    background: #4500b3;
                }
            </style>
            <form id="noteForm">
                <input type="text" id="title" placeholder="Judul Catatan" required />
                <textarea id="body" placeholder="Isi Catatan" required></textarea>
                <button type="submit">Tambah Catatan</button>
            </form>
        `;
    }
}
customElements.define('note-form', NoteForm);
