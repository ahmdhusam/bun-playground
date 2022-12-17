import { Database } from "bun:sqlite";

const db = new Database("mybun.db");

createTable(db);

export default {
  port: 5000,
  async fetch(req) {
    if (new URL(req.url).pathname === "/e") process.exit(0);
    if (new URL(req.url).pathname !== "/") return new Response("404 Not Found");

    switch (req.method) {
      case "POST": {
        const userData = await req.json();
        await insetUser(userData);

        return new Response(JSON.stringify(userData));
      }
      case "GET": {
        const { user_count } = await Async(() =>
          db.query(`select COUNT(*) as user_count from users`).get()
        );

        const users = await Async(() =>
          db
            .query(
              `select * from users limit 50 OFFSET ${Math.floor(
                Math.random() * (user_count - 50)
              )}`
            )
            .all()
        );

        return new Response(JSON.stringify(users));
      }
      default:
        return new Response("404 Not Found");
    }
  },
};

async function toAsync(fn) {
  return new Promise((r) => {
    const data = fn();
    r(data);
  });
}

function createTable(db) {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name varchar(255),
            userName varchar(255),
            email varchar(255),
            bio varchar(255),
            birthDate varchar(255),
            gender varchar(255),
            avatar varchar(255),
            header varchar(255),
            password varchar(255)
            )`
  );
}

async function insetUser({
  name,
  userName,
  email,
  bio,
  birthDate,
  gender,
  avatar,
  header,
  password,
}) {
  // TODO:
  return Async(() =>
    db.run(`insert into users(name, userName, email, bio, birthDate, gender, avatar, header, password)
            values(
                '${name}',
                '${userName}',
                '${email}',
                '${bio}',
                '${birthDate}',
                '${gender}',
                '${avatar}',
                '${header}',
                '${password}'
                )`)
  );
}
