const delConfirm = document.querySelector(".delStudent");
const addBtn = document.querySelector(".btnAdd");
const delBtns = document.querySelectorAll(".btnDel");
const addWindow = document.querySelector(".addStudent");
const delWindow = document.querySelector(".delStudent");
const subDel = delConfirm.querySelector("#yes");
const subAdd = document.querySelector(".subAdd");
const table = document.querySelector(".table")
const changeBtns = document.querySelectorAll(".btnChange");
const closeBtns = document.querySelectorAll(".close");
const changeWindow = document.querySelector(".changeStudent");
const subChange = document.querySelector(".subChange");
const addForm = document.querySelector(".addForm");
const changeForm = document.querySelector(".changeForm");
let currentRow = null;

closeBtns.forEach(btn => {
    btn.addEventListener("click", evt => {
        evt.target.parentElement.style.display = "none";
        addForm.reset();
        changeForm.reset();
    })
})

addBtn.addEventListener("click", (e)=> {
    e.preventDefault();
    addWindow.style.display = "flex";
})
subAdd.addEventListener("click", evt => {
    evt.preventDefault()
    const data = getDataFromForm(addForm)
    const row = render(data);
    table.append(row);
    addWindow.style.display = "none";
    addForm.reset();
})

let currentRowForDelete;
subDel.addEventListener("click", (e) => {
    e.preventDefault();
    currentRowForDelete.remove();
    delConfirm.style.display = "none";
});

delBtns.forEach((btn) => {
    btn.addEventListener("click", (evt) => {
        let link = evt.target;
        const tr = link.parentElement.parentElement;
        delWindow.style.display = "flex";
        currentRowForDelete = tr;
    });
});
changeBtns.forEach((btn) => {
    changeHandler(btn);
});

function changeHandler(btn) {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        changeWindow.style.display = "flex";
        currentRow = e.target.parentElement.parentElement;
        for (let i = 0; i < currentRow.children.length - 2; i++) {
            let allFormInput = changeForm.querySelectorAll("input");
            if (i === 1) {
                allFormInput[i].value = currentRow.children[i].textContent.split(".").reverse().join("-");
            }
            else {
                allFormInput[i].value = currentRow.children[i].textContent;
            }
        }
    });
}

subChange.addEventListener("click", (e) => {
    e.preventDefault();
    const data = getDataFromForm(changeForm);
    changeWindow.style.display = "none";
    changeForm.reset();
    let arrayOfData = Object.values(data)
    console.log(arrayOfData);
    for (let i = 0; i < currentRow.children.length - 2; i++) {
        currentRow.children[i].textContent = arrayOfData[i];
        if (i === 1) {
            currentRow.children[i].textContent = arrayOfData[i].split("-").reverse().join(".");
        }
    }
});

function getDataFromForm(selector) {
    const name = selector.querySelector(".name").value
    const date = selector.querySelector(".date").value
    const email = selector.querySelector(".email").value
    const tel = selector.querySelector(".tel").value
    return {
        name,
        date,
        email,
        tel,
    }
}

function render(data) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btnDel";
    deleteBtn.textContent = "Удалить";
    const changeBtn = document.createElement("button");
    changeBtn.className = "btnChange";
    changeBtn.textContent = "Изменить";

    const tdDelete = createTd();
    tdDelete.append(deleteBtn);
    deleteBtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        let link = evt.target;
        const td = link.parentElement.parentElement;
        delConfirm.style.display = "flex";
        currentRowForDelete = td;
     });
    changeHandler(changeBtn)
    const tdChange = createTd();
    tdChange.append(changeBtn);
    const element = `
      <td>${data.name}</td>
      <td>${data.date.split("-").reverse().join(".")}</td>
      <td>${data.email}</td>
      <td>${data.tel}</td>
  `;
    const tr = document.createElement("tr");
    tr.innerHTML = element;
    tr.append(tdChange, tdDelete);
    return tr;
}
function createTd() {
    return document.createElement("td");
}
