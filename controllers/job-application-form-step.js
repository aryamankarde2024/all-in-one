import connection from "../connection.js";

const patterns = {
  textOnly: "^[a-zA-Z\\s]+$",
  numberOnly: "^\\d+$",
  email: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  phone:
    "^\\s*(?:\\+?(\\d{1,3}))?([-. (]*(\\d{3})[-. )]*)?((\\d{3})[-. ]*(\\d{2,4})(?:[-.x ]*(\\d+))?)\\s*$",
  zipcode: "^\\d{6}$",
  date: "^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$",
  year: "^(19[0-9]{2}|2[0-9]{3})$",
  percentage: "^(([0-9]?[0-9]{1})|100)$",
  notice: "^([0-8]?[0-9]{1}|90)$",
};

// Pattern Field is optional
const validation = {
  basicDetails: {
    fname: {
      required: true,
      pattern: patterns.textOnly,
    },
    lname: {
      required: true,
      pattern: patterns.textOnly,
    },
    designation: {
      required: true,
      pattern: patterns.numberOnly,
    },
    addr1: {
      required: true,
    },
    addr2: {
      required: false,
    },
    email: {
      required: true,
      pattern: patterns.email,
    },
    phone: {
      required: true,
      pattern: patterns.phone,
    },
    state: {
      required: true,
      pattern: patterns.numberOnly,
    },
    city: {
      required: true,
      pattern: patterns.numberOnly,
    },
    gender: {
      required: true,
      pattern: patterns.numberOnly,
    },
    zip: {
      required: true,
      pattern: patterns.zipcode,
    },
    relationship: {
      required: true,
      pattern: patterns.numberOnly,
    },
    dob: {
      required: true,
      pattern: patterns.date,
    },
  },
  education: {
    ssc: {
      id: {
        required: true,
        pattern: patterns.numberOnly,
      },
      ssc_board: {
        required: true,
        pattern: patterns.numberOnly,
      },
      ssc_passing_year: {
        required: true,
        pattern: patterns.year,
      },
      ssc_percentage: {
        required: true,
        pattern: patterns.percentage,
      },
    },
    hsc: {
      id: {
        required: true,
        pattern: patterns.numberOnly,
      },
      hsc_board: {
        required: true,
        pattern: patterns.numberOnly,
      },
      hsc_passing_year: {
        required: true,
        pattern: patterns.year,
      },
      hsc_percentage: {
        required: true,
        pattern: patterns.percentage,
      },
    },
    bachelor: {
      id: {
        required: true,
        pattern: patterns.numberOnly,
      },
      bachelor_course: {
        required: true,
        pattern: patterns.numberOnly,
      },
      bachelor_university: {
        required: true,
        pattern: patterns.numberOnly,
      },
      bachelor_passing_year: {
        required: true,
        pattern: patterns.year,
      },
      bachelor_percentage: {
        required: true,
        pattern: patterns.percentage,
      },
    },
  },
  master: {
    eid: {
      required: true,
      pattern: patterns.numberOnly,
    },
    master_course: {
      required: true,
      pattern: patterns.numberOnly,
    },
    master_university: {
      required: true,
      pattern: patterns.numberOnly,
    },
    master_passing_year: {
      required: true,
      pattern: patterns.year,
    },
    master_percentage: {
      required: true,
      pattern: patterns.percentage,
    },
  },
  experience: {
    eid: {
      required: true,
      pattern: patterns.numberOnly,
    },
    company_name: {
      required: true,
      pattern: patterns.textOnly,
    },
    designation: {
      required: true,
      pattern: patterns.numberOnly,
    },
    f: {
      required: true,
      pattern: patterns.date,
    },
    t: {
      required: true,
      pattern: patterns.date,
    },
  },
  language: {
    eid: {
      required: true,
      pattern: patterns.numberOnly,
    },
    option_id: {
      required: true,
      pattern: patterns.numberOnly,
    },
    read: {
      required: false,
    },
    write: {
      required: false,
    },
    speak: {
      required: false,
    },
  },
  technologies: {
    eid: {
      required: true,
      pattern: patterns.numberOnly,
    },
    option_id: {
      required: true,
      pattern: patterns.numberOnly,
    },
    level: {
      required: true,
      pattern: patterns.numberOnly,
    },
  },
  reference: {
    eid: {
      required: true,
      pattern: patterns.numberOnly,
    },
    name: {
      required: true,
      pattern: patterns.textOnly,
    },
    phone: {
      required: true,
      pattern: patterns.phone,
    },
    relation: {
      required: true,
      pattern: patterns.numberOnly,
    },
  },
  preference: {
    id: {
      required: true,
      pattern: patterns.numberOnly,
    },
    prefered_location: {
      required: true,
      pattern: patterns.numberOnly,
    },
    notice_period_in_days: {
      required: false,
      pattern: patterns.notice,
    },
    current_ctc: {
      required: true,
      pattern: patterns.numberOnly,
    },
    expected_ctc: {
      required: true,
      pattern: patterns.numberOnly,
    },
    department: {
      required: true,
      pattern: patterns.numberOnly,
    },
  },
};

function checkValidation(body, validation, res) {
  for (let arr of Object.entries(validation)) {
    const field = arr[0];
    const obj = arr[1];
    if (obj.required) {
      if (!body[field]) {
        res.json({
          status: "error",
          message: `${field} is required!`,
          field,
        });
        return false;
      }
    }

    // Note pattern is optional property
    if (obj?.pattern && body[field]) {
      if (!new RegExp(obj.pattern, "i").test(body[field])) {
        res.json({
          status: "error",
          message: `Invalid input for ${field}!`,
          field,
        });
        return false;
      }
    }
  }
  return true;
}

function generateInsertQuery(data, tablename) {
  let sqlQuery = `insert into ${tablename} (`;
  sqlQuery += Object.keys(data)
    .map((k) => `\`${k}\``)
    .join(", ");
  sqlQuery += ") values (";
  sqlQuery += Object.values(data)
    .map((v) => `\'${v}\'`)
    .join(", ");
  sqlQuery += ");";
  return sqlQuery;
}

function generateUpdateQuery(values, primaryKeys, tablename) {
  let sqlQuery = `update ${tablename} set`;
  let list = [];

  Object.entries(values).forEach((arr) => {
    let field = arr[0];
    let value = arr[1];

    if (!(field in primaryKeys)) {
      list.push(`\`${field}\` = \'${value}\'`);
    }
  });

  sqlQuery += list.join(",");
  sqlQuery += " where ";

  list = [];
  primaryKeys.forEach((key) => {
    list.push(`\`${key}\` = \'${values[key]}\'`);
  });

  sqlQuery += list.join(" AND ");
  return sqlQuery;
}

export const postCandidate = (req, res) => {
  try {
    if (checkValidation(req.body, validation.basicDetails, res)) {
      let sqlQuery = generateInsertQuery(req.body, "candidate");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const putCandidate = (req, res) => {
  try {
    if (checkValidation(req.body, validation.basicDetails, res)) {
      let sqlQuery = generateUpdateQuery(req.body, ["id"], "candidate");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const putEducation = (req, res) => {
  try {
    if (
      checkValidation(req.body, validation.education?.[req.body.detail], res)
    ) {
      body = Object.fromEntries(
        Object.entries(req.body).filter((arr) => arr[0] != "detail")
      );

      let sqlQuery = generateUpdateQuery(body, ["id"], "candidate");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const postMaster = (req, res) => {
  try {
    if (checkValidation(req.body, validation.master, res)) {
      let sqlQuery = generateInsertQuery(req.body, "education");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const putMaster = (req, res) => {
  try {
    if (checkValidation(req.body, validation.master, res)) {
      let sqlQuery = generateUpdateQuery(req.body, ["eid"], "education");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const postExperience = (req, res) => {
  try {
    if (checkValidation(req.body, validation.experience, res)) {
      let sqlQuery = generateInsertQuery(req.body, "experience");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const putExperience = (req, res) => {
  try {
    if (checkValidation(req.body, validation.experience, res)) {
      let sqlQuery = generateUpdateQuery(req.body, ["id", "eid"], "experience");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const postLanguage = (req, res) => {
  try {
    if (checkValidation(req.body, validation.language, res)) {
      if (req.body.speak || req.body.write || req.body.read) {
        let sqlQuery = generateInsertQuery(req.body, "language");

        new Promise((resolve, reject) => {
          connection.query(sqlQuery, (err, results) => {
            if (err) reject(err);
            resolve(results);
          });
        })
          .then((data) =>
            res.json({ status: "success", message: data.insertId })
          )
          .catch((err) => res.json({ status: "error", message: err.message }));
      } else {
        res.json({
          status: "error",
          message: "Either read, write or speak values must be present.",
        });
      }
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const putLanguage = (req, res) => {
  try {
    if (checkValidation(req.body, validation.language, res)) {
      if (req.body.speak || req.body.write || req.body.read) {
        let sqlQuery = generateUpdateQuery(
          req.body,
          ["eid", "option_id"],
          "language"
        );

        new Promise((resolve, reject) => {
          connection.query(sqlQuery, (err, results) => {
            if (err) reject(err);
            resolve(results);
          });
        })
          .then((data) =>
            res.json({ status: "success", message: data.insertId })
          )
          .catch((err) => res.json({ status: "error", message: err.message }));
      } else {
        res.json({
          status: "error",
          message: "Either read, write or speak values must be present.",
        });
      }
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const postTechnologies = (req, res) => {
  try {
    if (checkValidation(req.body, validation.technologies, res)) {
      let sqlQuery = generateInsertQuery(req.body, "technologies");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const putTechnologies = (req, res) => {
  try {
    if (checkValidation(req.body, validation.technologies, res)) {
      let sqlQuery = generateUpdateQuery(
        req.body,
        ["eid", "option_id"],
        "technologies"
      );

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const postReference = (req, res) => {
  try {
    if (checkValidation(req.body, validation.reference, res)) {
      let sqlQuery = generateInsertQuery(req.body, "reference");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const putReference = (req, res) => {
  try {
    if (checkValidation(req.body, validation.preference, res)) {
      let sqlQuery = generateUpdateQuery(req.body, ["id"], "candidate");

      new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      })
        .then((data) => res.json({ status: "success", message: data.insertId }))
        .catch((err) => res.json({ status: "error", message: err.message }));
    }
    return;
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const getComboDetails = (req, res) => {
  try {
    let sqlQuery = `
              SELECT
                  s.id, s.name, s.control_type, s.css, s.allow_multiple, o.id as opt_id, value
              FROM
                  select_master AS s
                      INNER JOIN
                  option_master AS o ON s.id = o.sid
              WHERE
                  s.name LIKE '${req.params.name}'
          `;

    new Promise((resolve, reject) => {
      connection.query(sqlQuery, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
      .then((data) => res.json({ status: "success", message: data }))
      .catch((err) => res.json({ status: "error", message: err.message }));
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const getStates = (req, res) => {
  try {
    let sqlQuery = `
              SELECT
                  id, name
              FROM
                  state_master
          `;

    new Promise((resolve, reject) => {
      connection.query(sqlQuery, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
      .then((data) => res.json({ status: "success", message: data }))
      .catch((err) => res.json({ status: "error", message: err.message }));
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const getCities = (req, res) => {
  try {
    let sqlQuery = `
              SELECT
                  id, sid, name
              FROM
                  city_master
          `;

    new Promise((resolve, reject) => {
      connection.query(sqlQuery, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
      .then((data) => res.json({ status: "success", message: data }))
      .catch((err) => res.json({ status: "error", message: err.message }));
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
};

export const list = (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(
      `select count(1) as total from candidate`,
      function (err, results) {
        if (err) reject(err);
        resolve(results);
      }
    );
  })
    .then((data) => {
      new Promise((resolve, reject) => {
        let pageSize = 10;

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

        let endQuery = `select id, fname, lname, email, phone, addr1 from candidate limit ${
          currentPage > 1 ? (currentPage - 1) * pageSize : 0
        }, ${pageSize}`;

        connection.query(endQuery, (err, results, fields) => {
          if (err) reject(err);
          resolve({
            grid: { results, fields },
            pagination: {
              total,
              firstPage,
              prevPage,
              currentPage,
              nextPage,
              lastPage,
              pathname: "list",
            },
          });
        });
      })
        .then((data) => res.render("job-application-form-step/list", { data }))
        .catch((err) => {
          console.log(err);
          res.send("Error Fetching Records");
        });
    })
    .catch((err) => {
      console.log(err);
      res.send("Error Fetching Records");
    });
};

export const home = (_, res) => {
  res.render("job-application-form-step/index", { data: {} });
};

export const getCandidateDetails = async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    res.end();
    return;
  }

  const data = await new Promise((resolve, reject) => {
    connection.query(
      `select * from candidate where id = ${id}`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  })
    .then((basicDetails) => {
      return new Promise((resolve, reject) => {
        connection.query(
          `select * from education where eid = ${id}`,
          (err, results) => {
            if (err) reject(err);
            resolve({ basicDetails, masterDetails: results });
          }
        );
      });
    })
    .then((data) => {
      return new Promise((resolve, reject) => {
        connection.query(
          `select * from experience where eid = ${id}`,
          (err, results) => {
            if (err) reject(err);
            resolve({ ...data, experience: results });
          }
        );
      });
    })
    .then((data) => {
      return new Promise((resolve, reject) => {
        connection.query(
          `select * from language where eid = ${id}`,
          (err, results) => {
            if (err) reject(err);
            resolve({ ...data, language: results });
          }
        );
      });
    })
    .then((data) => {
      return new Promise((resolve, reject) => {
        connection.query(
          `select * from reference where eid = ${id}`,
          (err, results) => {
            if (err) reject(err);
            resolve({ ...data, reference: results });
          }
        );
      });
    })
    .then((data) => {
      return new Promise((resolve, reject) => {
        connection.query(
          `select * from technologies where eid = ${id}`,
          (err, results) => {
            if (err) reject(err);
            resolve({ ...data, technologies: results });
          }
        );
      });
    });

  data.basicDetails = data.basicDetails[0];
  data.masterDetails = data.masterDetails[0];
  res.render("job-application-form-step/index", { data });
};
