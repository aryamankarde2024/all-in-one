import express from "express";
import mapping from "./constants.js";
import connection from "../index.js";

const router = express.Router();

const pageSize = 200;

// Normal Grid
router.get("/", (req, res) => {
  try {
    let fieldName = null;
    new Promise((resolve, reject) => {
      if (
        req.query.sort &&
        (req.query.value == "asc" || req.query.value == "desc")
      ) {
        for (let i in mapping) {
          if (req.query.sort.toString() == mapping[i]) {
            fieldName = i;
            break;
          }
        }
      }
      connection.query(
        connection.format(`SELECT count(1) as total FROM student_master`),
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    })
      .then((data) => {
        const total = Number(data[0].total);
        const currentPage = Number(req.query.p || 1);
        const firstPage = currentPage == 1 ? null : 1;
        const prevPage = currentPage >= 2 ? currentPage - 1 : null;
        const nextPage =
          currentPage < Math.ceil(total / pageSize) ? currentPage + 1 : null;
        const lastPage =
          currentPage < Math.ceil(total / pageSize)
            ? Math.ceil(total / pageSize)
            : null;
        const queryObj = new URLSearchParams(req.query);
        if (queryObj.has("p")) queryObj.delete("p");
        const queryString = fieldName ? queryObj.toString() : "";

        if (currentPage > Math.ceil(total / pageSize) || currentPage < 1)
          res.sendStatus(500);
        else {
          new Promise((resolve, reject) => {
            connection.query(
              connection.format(
                `SELECT * FROM student_master ${
                  fieldName
                    ? " ORDER BY " + fieldName + " " + req.query.value
                    : ""
                } LIMIT ${
                  currentPage > 1 ? (currentPage - 1) * pageSize : 0
                }, ${pageSize}`
              ),
              (err, results, fields) => {
                console.log(results);
                if (err) reject(err);
                resolve({
                  results,
                  fields,
                  total,
                  pageSize,
                  currentPage,
                  firstPage,
                  prevPage,
                  nextPage,
                  lastPage,
                  queryString,
                  fieldName,
                  sortValue: req.query.value,
                });
              }
            );
          })
            .then((data) =>
              res.render("pagination-demo/home", { ...data, mapping })
            )
            .catch((err) => res.send(err));
        }
      })
      .catch((err) => res.send(err));
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Normal Pagination
router.get("/pagination", (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      connection.format("SELECT count(1) as total FROM student_master"),
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  })
    .then((data) => {
      const total = Number(data[0].total);
      const currentPage = Number(req.query.p || 1);
      const firstPage = currentPage == 1 ? null : 1;
      const prevPage = currentPage >= 2 ? currentPage - 1 : null;
      const nextPage =
        currentPage < Math.ceil(total / pageSize) ? currentPage + 1 : null;
      const lastPage =
        currentPage < Math.ceil(total / pageSize)
          ? Math.ceil(total / pageSize)
          : null;

      if (currentPage > Math.ceil(total / pageSize) || currentPage < 1)
        res.sendStatus(500);
      else
        res.render("pagination-demo/pagination", {
          total,
          pageSize,
          currentPage,
          firstPage,
          prevPage,
          nextPage,
          lastPage,
        });
    })
    .catch((err) => res.send(err))
    .finally(() => res.end());
});

// Grid + Pagination
router.get("/list", (_, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      connection.format("SELECT * FROM student_master"),
      (err, results, fields) => {
        if (err) reject(err);
        resolve({ results, fields });
      }
    );
  })
    .then((data) =>
      res.render("pagination-demo/list", {
        data: { results: data.results, fields: data.fields, mapping },
      })
    )
    .catch((err) => res.send(err))
    .finally(() => res.end());
});

// Attendance
router.get("/attendance", (req, res) => {
  const pageS = 50;
  let fieldName = "id";
  let sortValue = "asc";
  let month = 12;
  let year = 2023;

  let mapping = {
    id: "GR No",
    name: "Student Name",
    present: "Present Days",
    percentage: "Attendance",
    "": "",
  };

  const queryObj = new URLSearchParams(req.query);

  if (
    req.query.sort &&
    (req.query.value == "asc" || req.query.value == "desc")
  ) {
    for (let i in mapping) {
      if (req.query.sort.toString() == mapping[i]) {
        fieldName = i;
        break;
      }
    }
    sortValue = req.query.value;
  }

  if (queryObj.has("filter")) {
    month = queryObj.get("filter").split(",")[0];
    year = queryObj.get("filter").split(",")[1];
  }

  if (queryObj.has("p")) {
    queryObj.delete("p");
  }

  const queryString = queryObj.toString();

  const sortQueryString = queryObj.has("filter")
    ? "&filter=" + queryObj.get("filter")
    : "";

  new Promise((resolve, reject) => {
    connection.query(
      connection.format(`
            SELECT
                count(student_id) as total
            FROM attendance_master as a
            WHERE
                MONTH(a.date) = ${month} AND YEAR(a.date) = ${year}
            GROUP BY date limit 1;
        `),
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  })
    .then((data) => {
      const total = Number(data[0].total);
      const currentPage = Number(req.query.p || 1);
      const firstPage = currentPage == 1 ? null : 1;
      const prevPage = currentPage >= 2 ? currentPage - 1 : null;
      const nextPage =
        currentPage < Math.ceil(total / pageS) ? currentPage + 1 : null;
      const lastPage =
        currentPage < Math.ceil(total / pageS)
          ? Math.ceil(total / pageS)
          : null;

      if (currentPage > Math.ceil(total / pageS) || currentPage < 1)
        res.sendStatus(500);
      else {
        new Promise((resolve, reject) => {
          connection.query(
            connection.format(`
                    SELECT
                        s.id,
                        s.name,
                        SUM(a.status) as present, 
                        CONCAT(ROUND((SUM(a.status) / count(a.status)) * 100, 2), "%") as percentage
                    FROM
                        attendance_master as a 
                            join
                        student_master as s on s.id = a.student_id 
                    WHERE MONTH(a.date) = ${month} AND YEAR(a.date) = ${year}
                    GROUP BY a.student_id
                    ORDER BY ${fieldName} ${sortValue}
                    LIMIT ${
                      currentPage > 1 ? (currentPage - 1) * pageS : 0
                    }, ${pageS}`),
            (err, results, fields) => {
              if (err) reject(err);
              resolve({
                results,
                fields,
                total,
                currentPage,
                firstPage,
                prevPage,
                nextPage,
                lastPage,
                queryString,
                month,
                year,
                sortValue,
                fieldName,
                sortQueryString,
              });
            }
          );
        })
          .then((data) =>
            res.render("pagination-demo/attendance", { ...data, mapping })
          )
          .catch((err) => res.send(err));
      }
    })
    .catch((err) => res.send(err));
});

// Result & Report Card
router.get("/result", (req, res) => {
  const pageS = 50;
  new Promise((resolve, reject) => {
    connection.query(
      connection.format(`SELECT count(1) as total FROM student_master`),
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  })
    .then((data) => {
      const total = Number(data[0].total);
      const currentPage = Number(req.query.p || 1);
      const firstPage = currentPage == 1 ? null : 1;
      const prevPage = currentPage >= 2 ? currentPage - 1 : null;
      const nextPage =
        currentPage < Math.ceil(total / pageS) ? currentPage + 1 : null;
      const lastPage =
        currentPage < Math.ceil(total / pageS)
          ? Math.ceil(total / pageS)
          : null;

      if (currentPage > Math.ceil(total / pageS) || currentPage < 1)
        res.sendStatus(500);
      else {
        new Promise((resolve, reject) => {
          connection.query(
            `
                    SELECT
                        s.id,
                        s.name,
                        SUM(CASE WHEN exam.type = 'Prelim' THEN result.obtained_practical_marks ELSE 0 END) as total_prelim_practical_marks,
                        SUM(CASE WHEN exam.type = 'Prelim' THEN result.obtained_theory_marks ELSE 0 END) as total_prelim_theory_marks,
                        
                        SUM(CASE WHEN exam.type = 'Terminal' THEN result.obtained_practical_marks ELSE 0 END) as total_terminal_practical_marks,
                        SUM(CASE WHEN exam.type = 'Terminal' THEN result.obtained_theory_marks ELSE 0 END) as total_terminal_theory_marks,
                        
                        SUM(CASE WHEN exam.type = 'Final' THEN result.obtained_practical_marks ELSE 0 END) as total_final_practical_marks,
                        SUM(CASE WHEN exam.type = 'Final' THEN result.obtained_theory_marks ELSE 0 END) as total_final_theory_marks,
                        
                        SUM(result.obtained_practical_marks + result.obtained_theory_marks) as total
                    FROM
                        student_master AS s
                            INNER JOIN
                        exam_result AS result ON s.id = result.student_id
                            INNER JOIN
                        exam_master AS exam ON result.exam_id = exam.id
                    GROUP BY s.id
                    ORDER BY s.id
                    LIMIT ${
                      currentPage > 1 ? (currentPage - 1) * pageS : 0
                    }, ${pageS};
                `,
            (err, results, fields) => {
              if (err) reject(err);
              resolve({
                results,
                fields,
                total,
                firstPage,
                prevPage,
                currentPage,
                nextPage,
                lastPage,
              });
            }
          );
        })
          .then((data) => {
            res.render("pagination-demo/results", data);
          })
          .catch((err) => res.send(err));
      }
    })
    .catch((err) => res.send(err));
});

router.get("/reportcard/:id", (req, res) => {
  let studentId = +req.params.id;
  new Promise((resolve, reject) => {
    connection.query(
      `
        SELECT
            s.name as student_name,
            subjectd.name as subject_name,
            exam.type,
            result.obtained_practical_marks as practical_marks,
            result.obtained_theory_marks as theory_marks
        FROM
            student_master as s
                INNER JOIN
            exam_result as result ON s.id = result.student_id
                INNER JOIN
            exam_master as exam ON exam.id = result.exam_id
                INNER JOIN
            subject_master as subjectd ON subjectd.id = result.subject_id
        WHERE s.id = ${studentId}
        `,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  })
    .then(
      (data) => {
        return new Promise((resolve, reject) => {
          connection.query(
            `
            SELECT
                CONCAT(ROUND((SUM(a.status) / count(a.status)) * 100, 2), " %") as percentage
            FROM
                attendance_master as a 
                    join
                student_master as s on s.id = a.student_id 
            WHERE s.id = ${studentId};
            `,
            (err, results) => {
              if (err) reject(err);
              resolve({
                data,
                percentage: results[0].percentage,
                id: studentId,
              });
            }
          );
        });
      },
      (err) => res.send(err)
    )
    .then((data) => {
      res.render("pagination-demo/reportCard", data);
    })
    .catch((err) => res.send(err));
});

export default router;
