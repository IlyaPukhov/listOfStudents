const data = new function () {
    this.create = (obj, callback) => util.ajax({method: "POST", body: JSON.stringify(obj)}, callback);

    this.get = (id, callback) => util.ajax({method: "GET", path: "/" + id}, callback);
    this.getAll = (callback) => util.ajax({method: "GET"}, callback);

    this.update = (obj, callback) => util.ajax({method: "PUT", body: JSON.stringify(obj)}, callback);

    this.delete = (id, callback) => util.ajax({method: "DELETE", path: "/" + id}, callback);
};

function changeDateFormat(date) {
    if (date.indexOf('.') === -1) {
        return date.split("-").reverse().join(".");
    } else {
        return date.split(".").reverse().join("-");
    }
}

const util = new function () {
    this.ajax = (params, callback) => {
        let url = "";
        if (params.path !== undefined) {
            url = params.path;
            delete params.path;
        }
        fetch("/student" + url, params).then(data => data.json()).then(callback);
    }
    this.q = selector => document.querySelectorAll(selector);
    this.id = id => document.getElementById(id);
    this.listen = function (elem, type, callback) {
        elem.addEventListener(type, callback);
    };
};

const student = new function () {
    this.submit = (event) => {
        event.preventDefault()
        let st = {
            name: util.q('.name')[0].value,
            date: changeDateFormat(util.q('.date')[0].value),
            email: util.q('.email')[0].value,
            tel: util.q('.tel')[0].value,
        };
        if (activeAdd) {
            data.create(st, () => {this.render()});
        } else {
            st.Id = activeStudent;
            data.update(st, () => {this.render()});
        }
        util.q('.addStudent')[0].style.display = 'none';
        this.render()
    };

    let activeAdd = null;
    let activeStudent = null;

    const remove = function () {
        activeStudent = this.dataset.id;
        data.get(activeStudent, (st) => {
            util.q('.delName')[0].innerHTML = st.name;
            util.q('.delStudent')[0].style.display = 'flex';
        });
    };

    const edit = function () {
        if (this.dataset) {
            activeStudent = this.dataset.id;
            activeAdd = false;
        }
        if (activeAdd) {
            util.q('.subBtn')[0].innerHTML = 'Добавить студента';
            util.q('.subBtn')[0].classList.replace('subChange', 'subAdd');
            util.q('.addForm')[0].reset();
        } else {
            util.q('.subBtn')[0].innerHTML = 'Изменить данные';
            util.q('.subBtn')[0].classList.replace('subAdd', 'subChange');

            data.get(activeStudent, (obj) => {
                util.q('.name')[0].value = obj.name;
                util.q('.date')[0].value = changeDateFormat(obj.date);
                util.q('.email')[0].value = obj.email;
                util.q('.tel')[0].value = obj.tel;
            });
        }
        util.q('.addStudent')[0].style.display = 'flex';
    }
    this.render = () => {
        let str = '';
        data.getAll((resp)=> {
            resp.forEach(obj => {
                    let tmp = tpl;
                    for (let k in obj) {
                        tmp = tmp.replaceAll(`{` + k + '}', obj[k]);
                    }
                    str += tmp;
                })
            util.q('.tableBody')[0].innerHTML = str;
            util.q('.btnDel').forEach(btn => {
                btn.addEventListener('click', remove);
            });
            util.q('.btnChange').forEach(btn => {
                btn.addEventListener('click', edit);
            });
            util.q('.close').forEach(elem => {
                elem.addEventListener('click', () => {
                    elem.parentElement.style.display = 'none';
                });
            });
        })
    };

    let tpl = `<tr>
                    <td class="id">{Id}</td>
                    <td class="nameStud">{name}</td>
                    <td>{date}</td>
                    <td>{email}</td>
                    <td>{tel}</td>
                    <td><button class="btnChange" data-id={Id}>Изменить</button></td>
                    <td><button class="btnDel" data-id={Id}>Удалить</button></td>
                </tr>`;

    const init = () => {
        this.render();
        util.q('.btnAdd')[0].addEventListener('click', () => {
            activeAdd = true;
            edit();
        })
        util.q('.subDel')[0].addEventListener('click', (event) => {
            event.preventDefault();
            data.delete(activeStudent, () => {this.render()});
            util.q('.delStudent')[0].style.display = 'none';
        })
    }

    util.listen(util.q('.addForm')[0], 'submit', (event) => {
        this.submit(event);
    })

    window.addEventListener('load', init);
}