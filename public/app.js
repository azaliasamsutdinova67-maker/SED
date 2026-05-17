const username =
    localStorage.getItem("username");

const role =
    localStorage.getItem("role");

const userInfo =
    document.getElementById("userInfo");

if(userInfo){

    userInfo.innerText =
        username + " (" + role + ")";

}

/* ВЫХОД */

function logout(){

    localStorage.clear();

    window.location.href =
        "login.html";

}

/* СОЗДАНИЕ */

async function saveDocument(){

    const name =
        document.getElementById("docName").value;

    const desc =
        document.getElementById("docDesc").value;

    await fetch("/documents", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:name,
            desc:desc

        })

    });

    alert("Документ создан");

    window.location.href =
        "created.html";

}

/* СОЗДАННЫЕ */

async function showCreatedDocuments(){

    const response =
        await fetch("/documents");

    let docs =
        await response.json();

    docs = docs.filter(
        d => d.status === "В создании"
    );

    renderDocs(
        docs,
        "createdDocs",
        true,
        false
    );

}

/* В РАБОТЕ */

async function showWorkDocuments(){

    const response =
        await fetch("/documents");

    let docs =
        await response.json();

    docs = docs.filter(
        d => d.status === "В работе"
    );

    renderDocs(
        docs,
        "workDocs",
        false,
        true
    );

}

/* ЗАВЕРШЕНО */

async function showCompletedDocuments(){

    const response =
        await fetch("/documents");

    let docs =
        await response.json();

    docs = docs.filter(
        d => d.status === "Завершено"
    );

    let html = createTable();

    docs.forEach(doc => {

        html += `

        <tr>

            <td>${doc.name}</td>

            <td>${doc.desc}</td>

            <td>${doc.date}</td>

            <td>${doc.status}</td>

        </tr>

        `;

    });

    html += `</table>`;

    document.getElementById(
        "completedDocs"
    ).innerHTML = html;

}

/* ТАБЛИЦА */

function createTable(){

    return `

    <table>

        <tr>

            <th>Название</th>

            <th>Описание</th>

            <th>Дата</th>

            <th>Действия</th>

        </tr>

    `;

}

/* РЕНДЕР */

function renderDocs(
    docs,
    elementId,
    workButton,
    completeButton
){

    let html = createTable();

    docs.forEach(doc => {

        html += `

        <tr>

            <td>${doc.name}</td>

            <td>${doc.desc}</td>

            <td>${doc.date}</td>

            <td>

        `;

        if(workButton){

            html += `

            <button
            class="move-btn"
            onclick="moveToWork(${doc.id})">

                В работу

            </button>

            `;

        }

        if(completeButton){

            html += `

            <button
            class="move-btn"
            onclick="moveToCompleted(${doc.id})">

                Завершить

            </button>

            `;

        }

        html += `

            <button
            class="edit-btn"
            onclick="editDocument(${doc.id})">

                Изменить

            </button>

            <button
            class="delete-btn"
            onclick="deleteDocument(${doc.id})">

                Удалить

            </button>

            </td>

        </tr>

        `;

    });

    html += `</table>`;

    document.getElementById(
        elementId
    ).innerHTML = html;

}

/* В РАБОТУ */

async function moveToWork(id){

    const response =
        await fetch("/documents");

    let docs =
        await response.json();

    const doc =
        docs.find(d => d.id == id);

    await fetch(`/documents/${id}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:doc.name,
            desc:doc.desc,
            status:"В работе"

        })

    });

    showCreatedDocuments();

}

/* ЗАВЕРШИТЬ */

async function moveToCompleted(id){

    const response =
        await fetch("/documents");

    let docs =
        await response.json();

    const doc =
        docs.find(d => d.id == id);

    await fetch(`/documents/${id}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:doc.name,
            desc:doc.desc,
            status:"Завершено"

        })

    });

    showWorkDocuments();

}

/* DELETE */

async function deleteDocument(id){

    await fetch(`/documents/${id}`, {

        method:"DELETE"

    });

    location.reload();

}

/* EDIT */

async function editDocument(id){

    const response =
        await fetch("/documents");

    let docs =
        await response.json();

    let doc =
        docs.find(d => d.id == id);

    const newName =
        prompt(
            "Название",
            doc.name
        );

    const newDesc =
        prompt(
            "Описание",
            doc.desc
        );

    await fetch(`/documents/${id}`, {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            name:newName,
            desc:newDesc,
            status:doc.status

        })

    });

    location.reload();

}
