import express from "express";
import handlebars from "express-handlebars";
import path from "path";
const __dirname = path.resolve();

let app = express();
var port = 3000;
app.set("views", path.join(__dirname + "/app/views"));

app.set("view engine", "handlebars");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: "app/views/layouts",
    extname: "hbs",
    defaultLayout: "index.hbs",
  })
);

app.get("/", (rq, rs) => {
  rs.render("home.hbs");
});

app.listen(port, () => {
  console.log("e");
});
