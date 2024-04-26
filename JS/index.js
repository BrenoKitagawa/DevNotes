//elementos

const notesContainer=document.querySelector('#note-container')

const notesInput=document.querySelector('#note-content')

const addNoteBtn=document.querySelector('.add-note')

const search=document.querySelector('#search-input')

const exportNotes=document.querySelector('#export-notes')



//função
function showNotes(){
    cleanNotes()

    getNotes().forEach(note=>{
        const noteElemente=createNote(note.id,note.content,note.fixed)

        notesContainer.appendChild(noteElemente)
    })
}

function cleanNotes(){
    notesContainer.innerHTML=""
}

function addNote(){

    if(notesInput.value == "")return
    const notes=getNotes()
    const noteObjecte={
        id:generateId(),
        content:notesInput.value,
        fixed:false
    }

    const noteElement=createNote(noteObjecte.id,noteObjecte.content);

    notesContainer.appendChild(noteElement)

    notes.push(noteObjecte)

    saveNotes(notes)

    notesInput.value= ""
    
}



function generateId(){
    return Math.floor(Math.random()*5000)
}




function createNote(id,content,fixed){

    const element=document.createElement('div')
    element.classList.add('note')

    const textArea=document.createElement('textarea')
    textArea.value=content
    textArea.placeholder= " adicione algum texto..."

    element.appendChild(textArea)


    const pinIcon= document.createElement('i')
    pinIcon.classList.add(...["bi","bi-pin"])
    element.appendChild(pinIcon)

    const DeleteIcon= document.createElement('i')
    DeleteIcon.classList.add(...["bi","bi-x-lg"])
    element.appendChild(DeleteIcon)

    const duplicateIcon= document.createElement('i')
    duplicateIcon.classList.add(...["bi","bi-file-earmark-plus"])
    element.appendChild(duplicateIcon)

    if(fixed){
        element.classList.add('fixed')
    }

    // eventos
    element.querySelector("textarea").addEventListener('keyup',(e)=>{
        const noteContent= e.target.value 

        updateNote(id,noteContent)
    })


    element.querySelector('.bi-pin').addEventListener('click',()=>{
        toggleFixedNote(id)
    })

    element.querySelector('.bi-x-lg').addEventListener('click',()=>{
        DeleteNote(id,element)
    })
    element.querySelector('.bi-file-earmark-plus').addEventListener('click',()=>{
       copyNote(id)
    })


    return element

}

function toggleFixedNote(id){
    const notes = getNotes()
    const targetNotes=notes.filter(notes=> notes.id === id)[0]

    targetNotes.fixed=!targetNotes.fixed

    saveNotes(notes)

    showNotes()
}

function  DeleteNote(id,element){

    const notes= getNotes().filter(note=> note.id !== id)
    saveNotes(notes)
    notesContainer.removeChild(element)

}

function  copyNote(id){
    const notes = getNotes()

    const targetNotes=notes.filter(note=> note.id === id)[0]

    const noteObject={
        id:generateId(),
        content:targetNotes.content,
        fixed:false
    }


    const noteElement = createNote(noteObject.id ,noteObject.content,noteObject.fixed)

    notesContainer.appendChild(noteElement)

    notes.push(noteObject)

    saveNotes(notes)
}

function updateNote(id,newContent){

    const notes=getNotes()

    const targetNote=notes.filter(note => note.id === id)[0]

    targetNote.content =newContent

    saveNotes(notes)

}

//localStorage


function getNotes(){
    const notes=JSON.parse(localStorage.getItem('notes')|| "[]")
    
    const orderNotes=notes.sort((a,b)=> a.fixed >b.fixed ? -1 : 1)
    
    return orderNotes;
}

function saveNotes(notes){
    localStorage.setItem('notes',JSON.stringify(notes))
}

function searchNotes(search){

    const searchResultes =getNotes().filter(notes=> {
      return notes.content.includes(search)
    })

    if(search !==""){
        cleanNotes()

        searchResultes.forEach((note)=> {
            const noteElement=createNote(note.id,note.content)
            notesContainer.appendChild(noteElement)
        }) 
        return
    }

    cleanNotes()

    showNotes()

   
}

function exportData(){

    const notes = getNotes()

    const csvString=[
        ["ID" , "Conteudo", "Fixado?"],
        ...notes.map(note=> [note.id,note.content,note.fixed]),
    ].map(e=>e.join(",")).join("\n");

    const element=document.createElement('a')
element.href= "data:text/csv;charset=utf-8" +encodeURI(csvString)
element.target ="_blank"
element.download = "notes.csv"

element.click()

}

//eventos

addNoteBtn.addEventListener('click',()=>addNote())

search.addEventListener('keyup',(e)=>{

    const search=e.target.value

    searchNotes(search)
})

notesInput.addEventListener('keydown', (e)=>{
    if(e.key === "Enter"){
        addNote()
    }
})

exportNotes.addEventListener('click',()=>{
    exportData()
})


//inicialização

showNotes()