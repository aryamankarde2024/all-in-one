function generateCombo(connection, combo, selectedValues = {}) {
  let s = "";

  let sql = `
            SELECT
                s.id, s.name, s.control_type, s.css, s.allow_multiple, o.id as opt_id, value
            FROM
                select_master AS s
                    INNER JOIN
                option_master AS o ON s.id = o.sid
            WHERE
                s.name LIKE '${combo}'
    `;

  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, results) {
      if (err) reject(err);
      resolve(results);
    });
  })
    .then((results) => {
      if (combo == "Languages") {
        results.forEach((e) => {
          s += `
                    <tr>
                    <td>
                        <input type="checkbox" name="${e.name}" id="${
            e.name + e.opt_id
          }" value=${e.opt_id}
                            ${
                              selectedValues["Languages"]?.filter(
                                (obj) => obj.option_id == e.opt_id
                              ).length > 0
                                ? "checked"
                                : ""
                            }
                        />
                        ${e.value}
                    </td>
                    <td>
                        <label for="Proficiency${e.opt_id}">
                            <input
                                type="checkbox"
                                name="Proficiency${e.opt_id}"
                                id="Proficiency37"
                                value="37"
                                ${
                                  selectedValues["Languages"]?.filter(
                                    (obj) => obj.option_id == e.opt_id
                                  )[0]?.read
                                    ? "checked"
                                    : ""
                                }
                            />
                                Read
                        </label>
                        <label for="Proficiency${e.opt_id}">
                            <input
                                type="checkbox"
                                name="Proficiency${e.opt_id}"
                                id="Proficiency38"
                                value="38"
                                ${
                                  selectedValues["Languages"]?.filter(
                                    (obj) => obj.option_id == e.opt_id
                                  )[0]?.write
                                    ? "checked"
                                    : ""
                                }
                            />
                                Write
                        </label>
                        <label for="Proficiency${e.opt_id}">
                            <input
                                type="checkbox"
                                name="Proficiency${e.opt_id}"
                                id="Proficiency39"
                                value="39"
                                ${
                                  selectedValues["Languages"]?.filter(
                                    (obj) => obj.option_id == e.opt_id
                                  )[0]?.speak
                                    ? "checked"
                                    : ""
                                }
                            />
                                Speak
                        </label>
                    </td>
                    </tr>
                `;
        });
      } else if (combo == "Technologies") {
        results.forEach((e) => {
          s += `
                    <tr>
                    <td>
                        <input type="checkbox" name="${e.name}" id="${
            e.name + e.opt_id
          }" value=${e.opt_id}
                            ${
                              selectedValues["Technologies"]?.filter(
                                (obj) => obj.option_id == e.opt_id
                              ).length > 0
                                ? "checked"
                                : ""
                            }
                        />
                        ${e.value}
                    </td>
                    <td>
                        <label for="Level${e.opt_id}">
                            <input type="radio" name="Level${
                              e.opt_id
                            }" id="Level34" value="34" ${
            selectedValues["Technologies"]?.filter(
              (obj) => obj.level == 34 && obj.option_id == e.opt_id
            ).length > 0
              ? "checked"
              : ""
          } />
                                Beginner
                        </label>
                        <label for="Level${e.opt_id}">
                            <input type="radio" name="Level${
                              e.opt_id
                            }" id="Level35" value="35" ${
            selectedValues["Technologies"]?.filter(
              (obj) => obj.level == 35 && obj.option_id == e.opt_id
            ).length > 0
              ? "checked"
              : ""
          } />
                                Mediator
                        </label>
                        <label for="Level${e.opt_id}">
                            <input type="radio" name="Level${
                              e.opt_id
                            }" id="Level36" value="36" ${
            selectedValues["Technologies"]?.filter(
              (obj) => obj.level == 36 && obj.option_id == e.opt_id
            ).length > 0
              ? "checked"
              : ""
          } />
                                Expert
                        </label>
                    </td>
                    </tr>
                `;
        });
      } else {
        switch (results[0]?.control_type) {
          case "dropdown":
            s += `<select name="${results[0]?.name}"
                            id="${results[0]?.name + results[0]?.id}"
                            class="${results[0].css ?? ""}"
                            ${results[0].allow_multiple ? "multiple" : ""}
                    >`;

            results.forEach((element) => {
              s += `
                            <option 
                                id=${results[0]?.name + element.opt_id}
                                value=${element.opt_id}
                                ${
                                  selectedValues[results[0]?.name] ==
                                  element.opt_id
                                    ? "selected"
                                    : ""
                                }
                            >
                                ${element.value}
                            </option>
                        `;
            });

            s += `</select>`;
            break;
          case "radio":
            results.forEach((e) => {
              s += `
                        <input
                            type="radio"
                            class="${results[0].css}"
                            name="${results[0]?.name}"
                            id="${results[0]?.name + e.opt_id}"
                            value="${e.opt_id}"
                            ${
                              selectedValues[results[0]?.name] == e.opt_id
                                ? "checked"
                                : ""
                            }
                        >
                                ${e.value}
                        </input>`;
            });
            break;
          case "checkbox":
            results.forEach((e) => {
              s += `
                        <label for="${results[0]?.name}">
                            <input
                                type="checkbox"
                                name="${results[0]?.name}"
                                id="${results[0]?.name + e.opt_id}"
                                class="${results[0].css}"
                                value="${e.opt_id}"
                                ${
                                  selectedValues[results[0]?.name] == e.opt_id
                                    ? "checked"
                                    : ""
                                }
                            />
                                ${e.value}
                        </label>`;
            });
            break;
          default:
            break;
        }
      }
      return s;
    })
    .catch((err) => console.log(err));
}

export default generateCombo;
