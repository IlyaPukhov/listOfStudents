const data = new function () {
    let inc = 0;
    const arr = {};
    this.init = (callback) => {
        util.ajax({method: "GET"}, data => {
            data.map(std => {
                arr[std.Id] = std; //создаём новый массив, где студенту присваиваем Id
                inc = std.Id //чтобы не накладывались Id друг на друга
            });
            inc++;
            if (typeof callback == 'function') callback(); // чтобы render() выполнился после инициализации
        });
    }
    this.create = (obj) => {
        obj.Id = inc++;
        arr[obj.Id] = obj;
        util.ajax({method: "POST", body: JSON.stringify(obj)});
        return obj;
    };
    this.get = (id) => arr[id];
    this.getAll = () => {
        return Object.values(arr);
    }
    this.update = (id, obj) => {
        arr[id] = obj;
        util.ajax({method: "PUT", body: JSON.stringify(obj)});
        return obj;
    };
    this.delete = (id) => {
        delete arr[id];
        util.ajax({method: "DELETE", path: "/" + id});
    };
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
        fetch("/student" + url, params).then(data => data.json()).then(callback); //получаем данные в формате JSON и callback
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
            data.create(st);
        } else {
            st.Id = activeStudent;
            data.update(activeStudent, st);
        }
        util.q('.addStudent')[0].style.display = 'none';
        this.render()
    };

    let activeAdd = null;
    let activeStudent = null;

    const remove = function () {
        activeStudent = this.dataset.id;
        util.q('.delName')[0].innerHTML = data.get(activeStudent).name;
        util.q('.delStudent')[0].style.display = 'flex';
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

            let obj = data.get(activeStudent);
            util.q('.name')[0].value = obj.name;
            util.q('.date')[0].value = changeDateFormat(obj.date);
            util.q('.email')[0].value = obj.email;
            util.q('.tel')[0].value = obj.tel;
        }
        util.q('.addStudent')[0].style.display = 'flex';
    }
    this.render = () => {
        let str = '';
        data.getAll().forEach(obj => {
            let tmp = tpl;
            for (let k in obj) {
                tmp = tmp.replaceAll(`{` + k + '}', obj[k]);
            }
            str += tmp;
        });
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
        data.init(() => {
            this.render();
        });
        util.q('.btnAdd')[0].addEventListener('click', () => {
            activeAdd = true;
            edit();
        })
        util.q('.subDel')[0].addEventListener('click', (event) => {
            event.preventDefault();
            data.delete(activeStudent);
            this.render();
            util.q('.delStudent')[0].style.display = 'none';
        })
    }

    util.listen(util.q('.addForm')[0], 'submit', (event) => {
        this.submit(event);
    })

    window.addEventListener('load', init);
}