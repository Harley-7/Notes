//Elementos
const addBtn = document.querySelector("#add-btn");
const addContainer = document.querySelector("#add-container");
const exitBtn = document.querySelector("#exit-btn");
const noteInput = document.querySelector("#note-input");
const createBtn = document.querySelector("#add-note");
const notesContainer = document.querySelector("#notes-container");
const searchInput = document.querySelector("#search-input");
const exportBtn = document.querySelector("#export-notes");

//Funções
function showNotes(){

    cleanNotes();

    getNotes().forEach((note) => {

        const noteElement = createNote(note.id,note.content, note.fixed);

        notesContainer.appendChild(noteElement);

    } );

}

function createId(){
    return Math.floor(Math.random() * 5000);
}

function addNote(){
    const notes = getNotes();

    const noteObject = {
        id: createId(),
        content: noteInput.value,
        fixed: false
    };

    const noteElement = createNote(noteObject.id, noteObject.content);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);
    saveNotes(notes);

    noteInput.value = "";

}

function createNote(id, content, fixed){
    const element = document.createElement("div");
    element.classList.add("note");

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.placeholder = "Adicione algum texto...";

    element.appendChild(textarea);

    const pinIcon = document.createElement("i");
    pinIcon.classList.add(...["bi", "bi-pin"]);
    element.appendChild(pinIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);
    element.appendChild(deleteIcon);

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicateIcon);

    if(fixed){
        pinIcon.classList.add("fixed");
    }

    //Eventos do elemento
    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id);
    });

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element);
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id);
    })

    element.querySelector("textarea").addEventListener("keyup", (e) => {

        const noteContent = e.target.value;

        updateNote(id, noteContent);

    }); 

    return element;
}

function toggleFixNote(id){

    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
}

function deleteNote(id, element){
    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes);

    notesContainer.removeChild(element);

}

function copyNote(id){
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id: createId(),
        content: targetNote.content,
        fixed: false
    }

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed);

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);

    saveNotes(notes);

}

function updateNote(id, newContent){
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.content = newContent;

    saveNotes(notes);

}

function cleanNotes(){
    notesContainer.replaceChildren([]);
}

function searchNotes(search){
    
    const searchResults = getNotes().filter((note) => note.content.includes(search));

    if(searchResults !== ""){

        cleanNotes();

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content, note.fixed);
            notesContainer.appendChild(noteElement);
        });

        return;
    }

}

//LocalStorage
function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes));
}

function getNotes(){
   const notes = JSON.parse(localStorage.getItem("notes") || "[]");
   const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));
   return orderedNotes;
}


//Eventos
addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    addContainer.classList.remove("hide");
});

exitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    addContainer.classList.add("hide");
});

createBtn.addEventListener("click", () => {
    
    addNote();

    addContainer.classList.add("hide");

});

searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;

    searchNotes(search);

});

noteInput.addEventListener("keydown", (e) => {

    if(e.key === "Enter"){
        addNote();
        addContainer.classList.add("hide");
    }

});

exportBtn.addEventListener("click", () => {
    
    const notes = getNotes()

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ].map((e) => e.join(",")).join("\n");

   const element = document.createElement("a");
   element.href = "data:text/csv:charset=utf-8," + encodeURI(csvString);
   element.target = "_blank";
   element.download = "notes.csv";
   element.click();

});



//inicialização
showNotes();