const http = require("http"),
    crud = require("./crud"),
    static = require("node-static");

const staticFileDir = new static.Server("./public"); //создаем экземпляр статического файлового сервера для обслуживания "./public"

const echo = (res, content) => {
    res.end(JSON.stringify(content));
}

crud.create({
    name: "Абакумов Илья Александрович",
    date: "13.10.2002",
    email: "il.abakumoff@gmail.com",
    tel: "89201311755"
})
crud.create({
    name: "Аристов Даниил Владимирович",
    date: "16.12.2002",
    email: "danilka-aristov@mail.ru",
    tel: "89159939894"
})
crud.create({
    name: "Бабушкина Лидия Алексеевна",
    date: "10.08.2003",
    email: "babushckinalid@yandex.ru",
    tel: "89051312153"
})
crud.create({
    name: "Пухов Илья Николаевич",
    date: "01.08.2003",
    email: "dinamond2003@gmail.com",
    tel: "89997402433"
})
crud.create({
    name: "Сальникова Екатерина Андреевна",
    date: "31.07.2003",
    email: "katya63894@gmail.com",
    tel: "89502430004"
})
crud.create({
    name: "Себов Владислав Николаевич",
    date: "23.01.2003",
    email: "sebov.vlad@inbox.ru",
    tel: "89016961554"
})

const student = (req, res) => {
    res.writeHead(200, {"Content-type": "application/json"});
    const url = req.url.substring(1).split("/");
    switch (req.method) {
        case "GET":
            if (url.length > 1)
                echo(res, crud.get(url[1]));
            else
                echo(res, crud.getAll());
            break;
        case "POST":
            getAsyncData(req, data => {
                echo(res, crud.create(JSON.parse(data)));
            });
            break;
        case "PUT":
            getAsyncData(req, data => {
                echo(res, crud.update(JSON.parse(data)));
            });
            break;
        case "DELETE":
            if (url.length > 1)
                echo(res, crud.delete(url[1]));
            else
                echo(res, {error: "Не передан id"});
            break;
        default:
            echo(res, {error: "500"});//если в метод не вошел то вернем
    }
}
const getAsyncData = (req, callback) => {
    let data = "";
    req.on("data", chunk => {
        data += chunk;
    });
    req.on("end", () => {
        callback(data);
    });
}

const handler = function (req, res) {
    const url = req.url.substring(1).split("/");
    console.log(url);
    switch (url[0]) {
        case "student":
            student(req, res);
            return;
    }
    staticFileDir.serve(req, res); // статический файловый сервер для обслуживания
}

http.createServer(handler).listen(8096, () => {
    console.log("run");
})

