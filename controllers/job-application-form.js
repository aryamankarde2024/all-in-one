import connection from "../connection.js";
import { generateCombo } from "../helper.js";

export const home = async (_, res) => {
  res.render("job-application-form/index", {
    technologies: await generateCombo(connection, "Technologies"),
    designation: await generateCombo(connection, "Designation"),
    languages: await generateCombo(connection, "Languages"),
    department: await generateCombo(connection, "Department"),
    location: await generateCombo(connection, "Location"),
    relation: await generateCombo(connection, "Relation"),
    course: await generateCombo(connection, "Course"),
    university: await generateCombo(connection, "University"),
    board: await generateCombo(connection, "Board"),
    relationship: await generateCombo(connection, "Relationship"),
    savedValues: {},
  });
};

export const postHome = async (req, res) => {
  try {
    const body = req.body;
    const basicDetails = [];
    const masterEducation = [];
    const experienceDetails = [];
    const languageDetails = [];
    const referenceDetails = [];
    const technologiesDetails = [];
    let ssc = null,
      hsc = null,
      bachelor = null,
      master = null;

    if (Number(body.ssc_passing_year) && Number(body.ssc_percentage))
      ssc = Number(body.Board[0]);
    if (Number(body.hsc_passing_year) && Number(body.hsc_percentage))
      hsc = Number(body.Board[1]);
    if (Number(body.bachelor_passing_year) && Number(body.bachelor_percentage))
      bachelor = Number(body.Course[0]);
    if (Number(body.masters_passing_year) && Number(body.masters_percentage))
      master = Number(body.Course[1]);

    basicDetails.push(
      ...[
        body.fname,
        body.lname,
        Number(body.Designation[0]),
        body.addr1,
        body.addr2,
        body.email,
        Number(body.phone),
        body.gender,
        Number(body.zip_code),
        Number(body.Relationship),
        body.dob,
        ssc ?? false,
        ssc ? Number(body.ssc_passing_year) : false,
        ssc ? Number(body.ssc_percentage) : false,
        hsc ?? false,
        hsc ? Number(body.hsc_passing_year) : false,
        hsc ? Number(body.hsc_percentage) : false,
        bachelor ?? false,
        bachelor ? Number(body.University[0]) : false,
        bachelor ? Number(body.bachelor_passing_year) : false,
        bachelor ? Number(body.bachelor_percentage) : false,
        typeof body.Location == "string"
          ? Number(body.Location)
          : Number(body.Location[0]),
        Number(body.noticePeriod) ?? false,
        Number(body.expected_ctc) ?? false,
        Number(body.current_ctc) ?? false,
        Number(body.Department) ?? false,
      ]
    );

    let basicDetailsStr = `insert into candidate (
              fname,
              lname,
              designation,
              addr1,
              addr2,
              email,
              phone,
              gender,
              zip,
              relationship,
              dob,
              ssc_board,
              ssc_passing_year,
              ssc_percentage,
              hsc_board,
              hsc_passing_year,
              hsc_percentage,
              bachelor_course,
              bachelor_university,
              bachelor_passing_year,
              bachelor_percentage,
              prefered_location,
              notice_period_in_days,
              expected_ctc,
              current_ctc,
              department
          ) values (${basicDetails
            .map((e) => (e ? `'${e}'` : "NULL"))
            .toString()})`;

    new Promise((resolve, reject) => {
      connection.query(basicDetailsStr, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
      .then((data) => {
        const id = data.insertId;
        masterEducation.push(
          ...[
            id,
            master ?? false,
            master ? Number(body.University[1]) : false,
            master ? Number(body.master_passing_year) : false,
            master ? Number(body.master_percentage) : false,
          ]
        );

        let masterEducationStr = `insert into education (
                  eid,
                  master_course,
                  master_university,
                  master_passing_year,
                  master_percentage
              ) values (${masterEducation
                .map((e) => (e ? `'${e}'` : "NULL"))
                .toString()})`;

        experienceDetails.push(
          ...body.company
            .map(
              (value, index) =>
                value.length && [
                  id,
                  value,
                  body.Designation[index + 1],
                  body.starting_date[index],
                  body.ending_date[index],
                ]
            )
            .filter((e) => Boolean(e))
        );

        let experienceDetailsStr =
          `insert into experience (
                  eid,
                  company_name,
                  designation,
                  f,
                  t
              ) values ` + experienceDetails.map(() => "(?)").join();

        languageDetails.push(
          ...body.Languages.map(
            (value) =>
              value.length && [
                id,
                Number(value),
                body[`${"Proficiency" + value}`][0] ? 1 : 0,
                body[`${"Proficiency" + value}`][1] ? 1 : 0,
                body[`${"Proficiency" + value}`][2] ? 1 : 0,
              ]
          ).filter((e) => Boolean(e))
        );

        let languageDetailsStr =
          `insert into language (
                  \`eid\`,
                  \`option_id\`,
                  \`read\`,
                  \`write\`,
                  \`speak\`
              ) values ` + languageDetails.map(() => "(?)").join();

        referenceDetails.push(
          ...body.reference_name
            .map(
              (value, index) =>
                value.length && [
                  id,
                  value,
                  body.reference_contact[index],
                  body.Relation[index],
                ]
            )
            .filter((e) => Boolean(e))
        );

        let referenceDetailsStr =
          `insert into reference (
                  eid,
                  name,
                  phone,
                  relation
              ) values ` + referenceDetails.map(() => "(?)").join();

        technologiesDetails.push(
          ...body.Technologies.map(
            (value) => value.length && [id, value, body[`${"Level" + value}`]]
          ).filter((e) => Boolean(e))
        );

        let technologiesDetailsStr =
          `insert into technologies (
                  eid,
                  option_id,
                  level
              ) values ` + technologiesDetails.map(() => "(?)").join();

        const masterEducationPromise = new Promise((resolve, reject) => {
          connection.query(masterEducationStr, (err, results) => {
            if (err) reject(err);
            resolve(results);
          });
        });

        const experienceDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            experienceDetailsStr,
            experienceDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        const languageDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            languageDetailsStr,
            languageDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        const referenceDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            referenceDetailsStr,
            referenceDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        const technologiesDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            technologiesDetailsStr,
            technologiesDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        return Promise.allSettled([
          masterEducationPromise,
          experienceDetailsPromise,
          languageDetailsPromise,
          referenceDetailsPromise,
          technologiesDetailsPromise,
        ]);
      })
      .then((data) => {
        console.log(data);
        res.sendStatus(200);
      });
  } catch (error) {
    console.log(error);
  }
};

export const getById = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    connection.query(
      `select * from candidate where id = ${req.params.id}`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  })
    .then((basicDetails) => {
      return new Promise((resolve, reject) => {
        connection.query(
          `select * from education where eid = ${req.params.id}`,
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
          `select * from experience where eid = ${req.params.id}`,
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
          `select * from language where eid = ${req.params.id}`,
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
          `select * from reference where eid = ${req.params.id}`,
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
          `select * from technologies where eid = ${req.params.id}`,
          (err, results) => {
            if (err) reject(err);
            resolve({ ...data, technologies: results });
          }
        );
      });
    })
    .then((data) => {
      data = {
        Technologies: data.technologies,
        Languages: data.language,
        Department: data.basicDetails[0].department,
        Location: data.basicDetails[0].prefered_location,
        savedValues: {
          fname: data.basicDetails[0].fname,
          lname: data.basicDetails[0].lname,
          addr1: data.basicDetails[0].addr1,
          addr2: data.basicDetails[0].addr2,
          email: data.basicDetails[0].email,
          phone: data.basicDetails[0].phone,
          gender: data.basicDetails[0].gender,
          zip_code: data.basicDetails[0].zip,
          dob: data.basicDetails[0].dob,
          ssc_passing_year: data.basicDetails[0].ssc_passing_year,
          ssc_percentage: data.basicDetails[0].ssc_percentage,
          hsc_passing_year: data.basicDetails[0].hsc_passing_year,
          hsc_percentage: data.basicDetails[0].hsc_percentage,
          bachelor_passing_year: data.basicDetails[0].bachelor_passing_year,
          bachelor_percentage: data.basicDetails[0].bachelor_percentage,
          company: data.experience,
          reference: data.reference,
          noticePeriod: data.basicDetails[0].notice_period_in_days,
          expected_ctc: data.basicDetails[0].expected_ctc,
          current_ctc: data.basicDetails[0].current_ctc,
        },
      };
      return data;
    })
    .catch(() => res.sendStatus(404));

  res.render("job-application-form/index", {
    technologies: await generateCombo(connection, "Technologies", data),
    designation: await generateCombo(connection, "Designation"),
    languages: await generateCombo(connection, "Languages", data),
    department: await generateCombo(connection, "Department", data),
    location: await generateCombo(connection, "Location", data),
    relation: await generateCombo(connection, "Relation"),
    course: await generateCombo(connection, "Course"),
    university: await generateCombo(connection, "University"),
    board: await generateCombo(connection, "Board"),
    relationship: await generateCombo(connection, "Relationship"),
    savedValues: data.savedValues,
  });
};

export const postById = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;

    const basicDetails = [];
    const masterEducation = [];
    const experienceDetails = [];
    const languageDetails = [];
    const referenceDetails = [];
    const technologiesDetails = [];
    let ssc = null,
      hsc = null,
      bachelor = null,
      master = null;

    if (Number(body.ssc_passing_year) && Number(body.ssc_percentage))
      ssc = Number(body.Board[0]);
    if (Number(body.hsc_passing_year) && Number(body.hsc_percentage))
      hsc = Number(body.Board[1]);
    if (Number(body.bachelor_passing_year) && Number(body.bachelor_percentage))
      bachelor = Number(body.Course[0]);
    if (Number(body.masters_passing_year) && Number(body.masters_percentage))
      master = Number(body.Course[1]);

    basicDetails.push(
      ...[
        body.fname,
        body.lname,
        Number(body.Designation[0]),
        body.addr1,
        body.addr2,
        body.email,
        Number(body.phone),
        body.gender,
        Number(body.zip_code),
        Number(body.Relationship),
        body.dob,
        ssc ?? false,
        ssc ? Number(body.ssc_passing_year) : false,
        ssc ? Number(body.ssc_percentage) : false,
        hsc ?? false,
        hsc ? Number(body.hsc_passing_year) : false,
        hsc ? Number(body.hsc_percentage) : false,
        bachelor ?? false,
        bachelor ? Number(body.University[0]) : false,
        bachelor ? Number(body.bachelor_passing_year) : false,
        bachelor ? Number(body.bachelor_percentage) : false,
        typeof body.Location == "string"
          ? Number(body.Location)
          : Number(body.Location[0]),
        Number(body.noticePeriod) ?? false,
        Number(body.expected_ctc) ?? false,
        Number(body.current_ctc) ?? false,
        Number(body.Department) ?? false,
      ]
    );

    let basicDetailsStr = `update candidate
          set fname = ${basicDetails[0] ? `'${basicDetails[0]}'` : "NULL"},
              lname = ${basicDetails[1] ? `'${basicDetails[1]}'` : "NULL"},
              designation = ${
                basicDetails[2] ? `'${basicDetails[2]}'` : "NULL"
              },
              addr1 = ${basicDetails[3] ? `'${basicDetails[3]}'` : "NULL"},
              addr2 = ${basicDetails[4] ? `'${basicDetails[4]}'` : "NULL"},
              email = ${basicDetails[5] ? `'${basicDetails[5]}'` : "NULL"},
              phone = ${basicDetails[6] ? `'${basicDetails[6]}'` : "NULL"},
              gender = ${basicDetails[7] ? `'${basicDetails[7]}'` : "NULL"},
              zip = ${basicDetails[8] ? `'${basicDetails[8]}'` : "NULL"},
              relationship = ${
                basicDetails[9] ? `'${basicDetails[9]}'` : "NULL"
              },
              dob = ${basicDetails[10] ? `'${basicDetails[10]}'` : "NULL"},
              ssc_board = ${
                basicDetails[11] ? `'${basicDetails[11]}'` : "NULL"
              },
              ssc_passing_year = ${
                basicDetails[12] ? `'${basicDetails[12]}'` : "NULL"
              },
              ssc_percentage = ${
                basicDetails[13] ? `'${basicDetails[13]}'` : "NULL"
              },
              hsc_board = ${
                basicDetails[14] ? `'${basicDetails[14]}'` : "NULL"
              },
              hsc_passing_year = ${
                basicDetails[15] ? `'${basicDetails[15]}'` : "NULL"
              },
              hsc_percentage = ${
                basicDetails[16] ? `'${basicDetails[16]}'` : "NULL"
              },
              bachelor_course = ${
                basicDetails[17] ? `'${basicDetails[17]}'` : "NULL"
              },
              bachelor_university = ${
                basicDetails[18] ? `'${basicDetails[18]}'` : "NULL"
              },
              bachelor_passing_year = ${
                basicDetails[19] ? `'${basicDetails[19]}'` : "NULL"
              },
              bachelor_percentage = ${
                basicDetails[20] ? `'${basicDetails[20]}'` : "NULL"
              },
              prefered_location = ${
                basicDetails[21] ? `'${basicDetails[21]}'` : "NULL"
              },
              notice_period_in_days = ${
                basicDetails[22] ? `'${basicDetails[22]}'` : "NULL"
              },
              expected_ctc = ${
                basicDetails[23] ? `'${basicDetails[23]}'` : "NULL"
              },
              current_ctc = ${
                basicDetails[24] ? `'${basicDetails[24]}'` : "NULL"
              },
              department = ${
                basicDetails[25] ? `'${basicDetails[25]}'` : "NULL"
              }
          where id = ${id}`;

    new Promise((resolve, reject) => {
      connection.query(basicDetailsStr, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
      .then(() => {
        masterEducation.push(
          ...[
            master ?? false,
            master ? Number(body.University[1]) : false,
            master ? Number(body.master_passing_year) : false,
            master ? Number(body.master_percentage) : false,
          ]
        );

        let masterEducationStr = `update education
              set master_course = ${
                masterEducation[0] ? `'${masterEducation[0]}'` : "NULL"
              },
                  master_university = ${
                    masterEducation[1] ? `'${masterEducation[1]}'` : "NULL"
                  },
                  master_passing_year = ${
                    masterEducation[2] ? `'${masterEducation[2]}'` : "NULL"
                  },
                  master_percentage = ${
                    masterEducation[3] ? `'${masterEducation[3]}'` : "NULL"
                  }
              where eid = ${id}`;

        experienceDetails.push(
          ...body.company
            .map(
              (value, index) =>
                value.length && [
                  value,
                  body.Designation[index + 1],
                  body.starting_date[index],
                  body.ending_date[index],
                ]
            )
            .filter((e) => Boolean(e))
        );

        let experienceDetailsStr = "";

        experienceDetails.forEach((arr) => {
          experienceDetailsStr += `update experience
                  set company_name = ${arr[0] ? `'${arr[0]}'` : "NULL"},
                      designation = ${arr[1] ? `'${arr[1]}'` : "NULL"},
                      f = ${arr[2] ? `'${arr[2]}'` : "NULL"},
                      t = ${arr[3] ? `'${arr[3]}'` : "NULL"}
                  where eid = ${id};`;
        });

        languageDetails.push(
          ...body.Languages.map(
            (value) =>
              value.length && [
                Number(value),
                body[`${"Proficiency" + value}`][0] ? 1 : 0,
                body[`${"Proficiency" + value}`][1] ? 1 : 0,
                body[`${"Proficiency" + value}`][2] ? 1 : 0,
              ]
          ).filter((e) => Boolean(e))
        );

        let languageDetailsStr = "";

        languageDetails.forEach((arr) => {
          languageDetailsStr += `update language
                  set \`option_id\` = ${arr[0] ? `'${arr[0]}'` : "NULL"},
                      \`read\` = ${arr[1] ? `'${arr[1]}'` : "NULL"},
                      \`write\` = ${arr[2] ? `'${arr[2]}'` : "NULL"},
                      \`speak\` = ${arr[3] ? `'${arr[3]}'` : "NULL"}
                  where eid = ${id};`;
        });

        referenceDetails.push(
          ...body.reference_name
            .map(
              (value, index) =>
                value.length && [
                  value,
                  body.reference_contact[index],
                  body.Relation[index],
                ]
            )
            .filter((e) => Boolean(e))
        );

        let referenceDetailsStr = "";

        referenceDetails.forEach((arr) => {
          referenceDetailsStr += `update reference
                  set name = ${arr[0] ? `'${arr[0]}'` : "NULL"},
                      phone = ${arr[1] ? `'${arr[1]}'` : "NULL"},
                      relation = ${arr[2] ? `'${arr[2]}'` : "NULL"}
                  where eid = ${id};`;
        });

        technologiesDetails.push(
          ...body.Technologies.map(
            (value) => value.length && [value, body[`${"Level" + value}`]]
          ).filter((e) => Boolean(e))
        );

        let technologiesDetailsStr = "";

        technologiesDetails.forEach((arr) => {
          technologiesDetailsStr += `update technologies
                  set option_id = ${arr[0] ? `'${arr[0]}'` : "NULL"},
                      level = ${arr[1] ? `'${arr[1]}'` : "NULL"}
                  where eid = ${id};`;
        });

        const masterEducationPromise = new Promise((resolve, reject) => {
          connection.query(masterEducationStr, (err, results) => {
            if (err) reject(err);
            resolve(results);
          });
        });

        const experienceDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            experienceDetailsStr,
            experienceDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        const languageDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            languageDetailsStr,
            languageDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        const referenceDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            referenceDetailsStr,
            referenceDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        const technologiesDetailsPromise = new Promise((resolve, reject) => {
          connection.query(
            technologiesDetailsStr,
            technologiesDetails,
            (err, results) => {
              if (err) reject(err);
              resolve(results);
            }
          );
        });

        return Promise.allSettled([
          masterEducationPromise,
          experienceDetailsPromise,
          languageDetailsPromise,
          referenceDetailsPromise,
          technologiesDetailsPromise,
        ]);
      })
      .then((data) => {
        console.log(data);
        res.sendStatus(200);
      });
  } catch (error) {
    console.log(error);
  }
};
