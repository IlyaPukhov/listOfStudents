const data = new function () {
    let inc = 0;
    const arr = {};

    this.create = (obj) => {
        obj.id = ++inc;
        arr[obj.id] = obj;
    };

    this.get = (id) => arr[id];

    this.getAll = () => Object.values(arr);

    this.update = (id, obj) => {
        arr[id] = obj;
    };

    this.delete = (id) => {
        delete arr[id];
    };
};

data.create({
    name: 'Абакумов Илья Александрович',
    date: '13.10.2002',
    email: 'il.abakumoff@gmail.com',
    tel: '89201311755'
})
data.create({
    name: 'Аристов Даниил Владимирович',
    date: '16.12.2002',
    email: 'danilka-aristov@mail.ru',
    tel: '89159939894'
})
data.create({
    name: 'Бабушкина Лидия Алексеевна',
    date: '10.08.2003',
    email: 'babushckinalid@yandex.ru',
    tel: '89051312153'
})
data.create({
    name: 'Пухов Илья Николаевич',
    date: '01.08.2003',
    email: 'dinamond2003@gmail.com',
    tel: '89997402433'
})
data.create({
    name: 'Сальникова Екатерина Андреевна',
    date: '31.07.2003',
    email: 'katya63894@gmail.com',
    tel: '89502430004'
})
data.create({
    name: 'Себов Владислав Николаевич',
    date: '23.01.2003',
    email: 'sebov.vlad@inbox.ru',
    tel: '89016961554'
})

function changeDateFormat(date) {
    if (date.indexOf('.') === -1) {
        return date.split("-").reverse().join(".");
    } else {
        return date.split(".").reverse().join("-");
    }
}

const util = new function () {
    this.q = selector => document.querySelectorAll(selector);
    this.id = id => document.getElementById(id);
    this.listen = function (elem, type, callback) {
        elem.addEventListener(type, callback);
    };
};

const student = new function () {
    const render = () => {
        let str = '';
        let inc = 0;
        data.getAll().forEach(obj => {
            let tmp = tpl;
            tmp = tmp.replaceAll('{id}', ++inc);
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
        })

        util.q('.close').forEach(elem => {
            elem.addEventListener('click', () => {
                elem.parentElement.classList.replace('flex', 'hide');
            })
        });


    };

    const submit = function (event) {
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
            st.id = activeStudent;
            data.update(activeStudent, st);
        }

        util.q('.addStudent')[0].classList.replace('flex', 'hide');
        render()

    };

    let activeAdd = null;
    let activeStudent = null;

    const remove = function () {
        activeStudent = this.dataset.id;
        util.q('.delName')[0].innerHTML = data.get(activeStudent).name;
        util.q('.delStudent')[0].classList.replace('hide', 'flex');
    };


    const edit = function() {
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
        util.q('.addStudent')[0].classList.replace('hide', 'flex');
    }

    let tpl = `<tr>
                    <td class="id">{id}</td>
                    <td class="nameStud">{name}</td>
                    <td>{date}</td>
                    <td>{email}</td>
                    <td>{tel}</td>
                    <td><button class="btnChange" data-id={id}>Изменить</button></td>
                    <td><button class="btnDel" data-id={id}>Удалить</button></td>
                    
                </tr>`;

    const init = () => {

        render();

        util.q('.btnAdd')[0].addEventListener('click', () => {
            activeAdd = true;
            edit();
        })

        util.q('.subDel')[0].addEventListener('click', (event) => {
            event.preventDefault();
            data.delete(activeStudent);
            render();
            util.q('.delStudent')[0].classList.replace('flex', 'hide');
        })
    }

    util.listen(util.q('.addForm')[0], 'submit', (event) => {
        submit(event);
    })

    window.addEventListener('load', init);
}