import connection from "../connection.js";

export default (req, res) => {
  const pageS = 50;

  let mapping = {
    id: "GR No",
    name: "Student Name",
    present: "Present Days",
    percentage: "Attendance",
  };

  let student_id = null,
    name = null,
    percentage = null,
    operation = null,
    form1 = true,
    form2 = null;

  const queryObj = new URLSearchParams(req.query);

  if (queryObj.has("GRNo") && queryObj.get("GRNo").length) {
    student_id = isNaN(+queryObj.get("GRNo")) ? null : +queryObj.get("GRNo");
  } else {
    if (queryObj.has("name") && queryObj.get("name").length) {
      name = queryObj.get("name");
    }

    if (queryObj.has("percentage")) {
      percentage = +queryObj.get("percentage") || 0.1;
    }

    if (queryObj.has("operation")) {
      if (queryObj.get("operation") == "and") {
        operation = "AND";
      } else if (queryObj.get("operation") == "or") {
        operation = "OR";
      }
      form1 = null;
      form2 = true;
    }
  }

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
              ${student_id ? `WHERE id = ${student_id}` : ``}
              GROUP BY a.student_id
              ${
                operation
                  ? `HAVING ${
                      name ? `name like '${name}%'` : "FALSE"
                    } ${operation} ${
                      percentage ? `percentage >= ${percentage}` : "FALSE"
                    }`
                  : ``
              }
              LIMIT ${pageS}`),
      (err, results, fields) => {
        if (err) reject(err);
        resolve({
          results,
          fields,
        });
      }
    );
  })
    .then((data) =>
      res.render("search-functionality/attendance", {
        ...data,
        mapping,
        student_id,
        name,
        percentage,
        operation,
        form1,
        form2,
      })
    )
    .catch((err) => res.send(err));
};
