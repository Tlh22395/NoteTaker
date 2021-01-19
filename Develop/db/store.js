const util = require("util");
const fs = require("fs");

const { v1: uuidv1 } = require('uuid');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Store {
    read() {
        return readFile("db/db.json", "utf8");
    }

    write(notes) {
        return writeFile("db/db.json", JSON.stringify(notes));
    }

    getNotes() {
        return this.read().then((notes) => {
        let parsedNotes;

        try {
            parsedNotes = [].concat(JSON.parse(notes));
        } catch (err) {
            parsedNotes = [];
        }

        return parsedNotes;
        });
    }

    addNote(note) {
        const { title, text } = note;
        if (!title || !text) {
        throw new Error("Note 'title and 'text' cannot be blank");
        }

        const newNote = { title, text, id: uuidv1() };

        return this.getNotes()
        .then((notes) => [...notes, newNote])
        .then((updatedNotes) => this.write(updatedNotes))
        .then(() => newNote);
    }

    removeNote(id){
        return this.getNotes()
        .then((notes) => notes.filter((note) => note.id !== id))
        .then((filteredNotes) => this.write(filteredNotes))
        .then(() => id);
    }
    }

module.exports = new Store();