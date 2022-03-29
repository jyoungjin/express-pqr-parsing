const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);
const fs = require("fs");

const app = express();

const dir = "./static/";

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Root");
});

app.get("/users", (req, res) => {
  connection.query("SELECT * from pqr_info", (error, rows) => {
    if (error) {
      console.log("err: " + error);
      throw error;
    }

    console.log("pqr info is: ", rows);
    res.send(rows);
  });
});

app.get("/sparying-systems", (req, res) => {
  let companyName = "01. Spraying Systems";
  let files = fs.readdirSync(dir + companyName);

  let pqrInfoKeySet = new Set();

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    // 확장자 추출
    let suffix = file.substring(file.length - 5, file.length);
    let imgFileName = file.replace(".json", ".png");

    // 확장자가 json일 경우 읽어 내용 출력
    if (suffix === ".json") {
      // console.log(file);
      fs.readFile(dir + companyName + "/" + file, function (err, buf) {
        let json_parsing_buf = JSON.parse(buf);

        let keys = Object.keys(json_parsing_buf);

        let imgFilePath =
          dir + companyName + "/joint_design_img/" + imgFileName;

        if (!fs.existsSync(imgFilePath)) {
          isExist = false;
          console.log(
            "img 파일과 json 파일의 매칭이 제대로 이루어지지 않았습니다!"
          );
        }

        let pqr_info = json_parsing_buf.pqr_info;

        // date
        let parts = pqr_info.date.split(".");
        let mydate = new Date(parts[0], parts[1] - 1, parts[2]);

        // welding_type
        let weldingTypeArr = new Array(3);
        let weldingTypes = pqr_info.type.split("+");

        Object.keys(pqr_info).forEach((element, index) => {
          pqrInfoKeySet.add(element);
        });

        // console.log(" pqr_info.keys" + Object.keys(pqr_info));
        if (!pqr_info.no_value) {
        }

        for (let i = 0; i < weldingTypes.length; i++) {
          weldingTypeArr[i] = weldingTypes[i];
        }

        let sql =
          "INSERT INTO pqr_info (company, pqr_no, pqr_date, wps_no, wps_rev_no, welding_process1, welding_process2, welding_process3, welding_type1, welding_type2, welding_type3, origin_file_name, other) values ( ?,?,?,?,?,?,?,?,?,?,?,?,?)";

        // connection.query(
        //   sql,
        //   [
        //     pqr_info.company,
        //     pqr_info.procedure_qualification_record_no,
        //     mydate,
        //     pqr_info.welding_procedure_specification_no,
        //     0,
        //     pqr_info.welding_process1,
        //     pqr_info.welding_process2,
        //     pqr_info.welding_process3,
        //     weldingTypeArr[0],
        //     weldingTypeArr[1],
        //     weldingTypeArr[2],
        //     pqr_info.original_file_name,
        //     null,
        //   ],
        //   function (error, results, fields) {
        //     if (error) {
        //       throw error;
        //     }
        //   }
        // );
      });
    }
  }
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
