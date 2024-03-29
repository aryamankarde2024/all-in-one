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

const oldState = JSON.parse(document.getElementById("oldState")?.value || null);
let states, cities;

async function createPage() {
  states = await getStates();
  cities = await getCities();

  generateBasicDetailsForm();
}

createPage();

function generateBasicDetailsForm() {
  let formHTML = "";
  const root = document.getElementById("root");

  formHTML += `
        <fieldset name="basic_details">
            <legend>
                Basic Details
            </legend>

            <table cellspacing="10">
                <tr>
                    <td>First Name</td>
                    <td>
                        <input
                            type="text"
                            name="fname"
                            id="fname"
                            class="required textOnly"
                            ${
                              oldState?.basicDetails?.fname
                                ? `value = '${oldState?.basicDetails?.fname}'`
                                : ""
                            }
                        />
                    </td>
                    <td>Last Name</td>
                    <td>
                        <input
                            type="text"
                            name="lname" 
                            id="lname" 
                            class="required textOnly" 
                            ${
                              oldState?.basicDetails?.lname
                                ? `value = '${oldState?.basicDetails?.lname}'`
                                : ""
                            }
                        />
                    </td>
                </tr>

                <tr>
                    <td>Designation</td>
                    <td id='designationParent'>
                    </td>
                    <td>Address 1</td>
                    <td>
                        <textarea
                            name="addr1" 
                            id="addr1" 
                            cols="30" rows="10" 
                            class="required"
                        >${
                          oldState?.basicDetails?.addr1
                            ? `${oldState?.basicDetails?.addr1}`
                            : ""
                        }
                        </textarea>
                    </td>
                </tr>

                <tr>
                    <td>Email</td>
                    <td>
                        <input type="text" name="email" id="email" class="required email"
                            ${
                              oldState?.basicDetails?.email
                                ? `value = '${oldState?.basicDetails?.email}'`
                                : ""
                            }
                        />
                    </td>
                    <td>Address 2</td>
                    <td>
                        <textarea 
                            name="addr2" 
                            id="addr2" 
                            cols="30" rows="10"
                        >${
                          oldState?.basicDetails?.addr2
                            ? `${oldState?.basicDetails?.addr2}`
                            : ""
                        }
                        </textarea>
                    </td>
                </tr>

                <tr>
                    <td>Phone Number</td>
                    <td>
                        <input type="text" name="phone" id="phone" class="required phone"
                            ${
                              oldState?.basicDetails?.phone
                                ? `value = '${oldState?.basicDetails?.phone}'`
                                : ""
                            }
                        />
                    </td>
                    <td>State</td>
                    <td>
                        <select name="state" id="state" onchange="populateCities(event.target.value)">
                            ${states
                              .map(
                                (e) => `
                                    <option
                                        value=${e.id}
                                        
                                        ${
                                          oldState?.basicDetails?.state == e.id
                                            ? "selected"
                                            : ""
                                        }
                                    >
                                        ${e.name}
                                    </option>
                                `
                              )
                              .join("\n")}
                        </select>
                    </td>
                    <td>City</td>
                    <td>
                        <select name="city" id="city"></select>
                    </td>
                </tr>

                <tr>
                    <td>Gender</td>
                    <td>
                        <input type="radio" name="gender" id="gender" value="1" class="required"
                            ${
                              Number(oldState?.basicDetails?.gender) == 1
                                ? `checked = true`
                                : ""
                            }
                        />
                            Male
                        </input>

                        <input type="radio" name="gender" id="gender" value="0" class="required"
                            ${
                              Number(oldState?.basicDetails?.gender) == 0
                                ? `checked = true`
                                : ""
                            }
                        />
                            Female
                        </input>
                    </td>
                    <td>Zip Code</td>
                    <td>
                        <input type="text" name="zip" id="zip" class="required zipcode"
                            ${
                              oldState?.basicDetails?.zip
                                ? `value = '${oldState?.basicDetails?.zip}'`
                                : ""
                            }
                        />
                    </td>
                </tr>

                <tr>
                    <td>Relationship Status</td>
                    <td id="relationshipParent">
                    </td>
                    <td>
                        Date Of Birth
                    </td>
                    <td>
                        <input type="text" name="dob" id="dob" class="required dob"
                            ${
                              oldState?.basicDetails?.dob
                                ? `value = '${
                                    oldState?.basicDetails?.dob.split("T")[0]
                                  }'`
                                : ""
                            }
                        />
                    </td>
                </tr>
            </table>
        </fieldset>

        <div class="navigation">
            <span class="next-btn" onclick="handleBasicFormSubmit()">Next</span>
        </div>
    `;

  root.innerHTML = formHTML;

  populateCities(oldState?.basicDetails?.state || states[0].id);
  generateCombo("Designation", "designation", {
    designation: oldState?.basicDetails?.designation,
  });
  generateCombo("Relationship", "relationship", {
    relationship: oldState?.basicDetails?.relationship,
  });
}

function generateEducationForm() {
  let formHTML = "";
  const root = document.getElementById("root");

  formHTML += `
        <fieldset name="education_details">
            <legend>
                Education Detail
            </legend>

            <table cellspacing="10">
                <tr>
                    <td>SSC Result</td>
                </tr>
                <tr>
                    <td>
                        Name of Board
                    </td>
                    <td id='ssc_boardParent'>
                    </td>
                    <td>
                        Passing Year
                    </td>
                    <td>
                        <input type="text" name="ssc_passing_year" id="ssc_passing_year" class="required year"
                            ${
                              oldState?.basicDetails?.ssc_passing_year
                                ? `value = '${oldState?.basicDetails?.ssc_passing_year}'`
                                : ""
                            }
                        />
                    </td>
                    <td>
                        Percentage
                    </td>
                    <td>
                        <input type="text" name="ssc_percentage" id="ssc_percentage" class="required percentage"
                            ${
                              oldState?.basicDetails?.ssc_percentage
                                ? `value = '${oldState?.basicDetails?.ssc_percentage}'`
                                : ""
                            }
                        />
                    </td>
                </tr>
                <tr>
                    <td colspan="10">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <td>
                        HSC/Diploma Result
                    </td>
                </tr>
                <tr>
                    <td>
                        Name of Board
                    </td>
                    <td id="hsc_boardParent"></td>
                    <td>
                        Passing Year
                    </td>
                    <td>
                        <input type="year" name="hsc_passing_year" id="hsc_passing_year" class="required year"
                            ${
                              oldState?.basicDetails?.hsc_passing_year
                                ? `value = '${oldState?.basicDetails?.hsc_passing_year}'`
                                : ""
                            }
                        />
                    </td>
                    <td>
                        Percentage
                    </td>
                    <td>
                        <input type="year" name="hsc_percentage" id="hsc_percentage" class="required percentage"
                            ${
                              oldState?.basicDetails?.hsc_percentage
                                ? `value = '${oldState?.basicDetails?.hsc_percentage}'`
                                : ""
                            }
                        />
                    </td>
                </tr>
                <tr>
                    <td colspan="10">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <td>
                        Bachelor Degree
                    </td>
                </tr>
                <tr>
                    <td>
                        Course Name
                    </td>
                    <td id="bachelor_courseParent">
                    </td>
                    <td>
                        University
                    </td>
                    <td id="bachelor_universityParent">
                    </td>
                    <td>
                        Passing Year
                    </td>
                    <td>
                        <input type="text" name="bachelor_passing_year" id="bachelor_passing_year" class="required year"
                            ${
                              oldState?.basicDetails?.bachelor_passing_year
                                ? `value = '${oldState?.basicDetails?.bachelor_passing_year}'`
                                : ""
                            }
                        />
                    </td>
                    <td>
                        Percentage
                    </td>
                    <td>
                        <input type="text" name="bachelor_percentage" id="bachelor_percentage" class="required percentage"
                            ${
                              oldState?.basicDetails?.bachelor_percentage
                                ? `value = '${oldState?.basicDetails?.bachelor_percentage}'`
                                : ""
                            }
                        />
                    </td>
                </tr>
                <tr>
                    <td colspan="10">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <td>
                        Master Degree
                    </td>
                </tr>
                <tr>
                    <td>
                        Course Name
                    </td>
                    <td id="master_courseParent">
                    </td>
                    <td>
                        University
                    </td>
                    <td id="master_universityParent">
                    </td>
                    <td>
                        Passing Year
                    </td>
                    <td>
                        <input type="text" name="master_passing_year" id="master_passing_year" class="year"
                            ${
                              oldState?.masterDetails?.master_passing_year
                                ? `value = '${oldState?.masterDetails?.master_passing_year}'`
                                : ""
                            }
                        />
                    </td>
                    <td>
                        Percentage
                    </td>
                    <td>
                        <input type="text" name="master_percentage" id="master_percentage" class="percentage"
                            ${
                              oldState?.masterDetails?.master_percentage
                                ? `value = '${oldState?.masterDetails?.master_percentage}'`
                                : ""
                            }
                        />
                    </td>
                </tr>
            </table>
        </fieldset>

        <div class="navigation">
            <span class="prev-btn" onclick="generateBasicDetailsForm()">Prev</span>
            <span class="next-btn" onclick="handleEducationFormSubmit()">Next</span>
        </div>
    `;

  root.innerHTML = formHTML;

  generateCombo("Board", "ssc_board", {
    ssc_board: oldState?.basicDetails?.ssc_board,
  });
  generateCombo("Board", "hsc_board", {
    hsc_board: oldState?.basicDetails?.hsc_board,
  });

  generateCombo("Course", "bachelor_course", {
    bachelor_course: oldState?.basicDetails?.bachelor_course,
  });
  generateCombo("University", "bachelor_university", {
    bachelor_university: oldState?.basicDetails?.bachelor_university,
  });

  generateCombo("Course", "master_course", {
    master_course: oldState?.masterDetails?.master_course,
  });
  generateCombo("University", "master_university", {
    master_university: oldState?.masterDetails?.master_university,
  });
}

function generateExperienceForm() {
  let formHTML = "";
  const root = document.getElementById("root");

  formHTML += `
        <fieldset name="work_experience">
            <legend>Work Experience</legend>
            <div class="addExp">
              <button onclick="addExperience()">ADD</button>
            </div>
            <table cellspacing="10">
              <tbody id="experienceTable">
              </tbody>
            </table>
        </fieldset>

        <div class="navigation">
            <span class="prev-btn" onclick="generateEducationForm()">Prev</span>
            <span class="next-btn" onclick="handleWorkExperienceFormSubmit()">Next</span>
        </div>
    `;

  root.innerHTML = formHTML;

  if (oldState?.experience?.length) {
    oldState.experience.forEach((obj) => {
      addExperience(obj);
    });
  }
}

function generateLanguagesForm() {
  let formHTML = "";
  const root = document.getElementById("root");

  formHTML += `
        <fieldset name="languages">
          <legend>Languages Known</legend>

          <table cellspacing="10" id="languageParent">
          </table>
          
        </fieldset>

        <div class="navigation">
            <span class="prev-btn" onclick="generateExperienceForm()">Prev</span>
            <span class="next-btn" onclick="handleLanguagesFormSubmit()">Next</span>
        </div>
    `;

  root.innerHTML = formHTML;
  generateCombo("Languages", "language", {
    language: oldState?.language,
  });
}

function generateTechnologiesForm() {
  let formHTML = "";
  const root = document.getElementById("root");

  formHTML += `
        <fieldset name="technologies">
          <legend>
              Technologies you know
          </legend>

          <table cellspacing="10" id="technologiesParent">
          </table>
        </fieldset>

        <div class="navigation">
            <span class="prev-btn" onclick="generateLanguagesForm()">Prev</span>
            <span class="next-btn" onclick="handleTechnologiesFormSubmit()">Next</span>
        </div>
    `;

  root.innerHTML = formHTML;
  generateCombo("Technologies", "technologies", {
    technologies: oldState?.technologies,
  });
}

function generateReferenceForm() {
  let formHTML = "";
  const root = document.getElementById("root");

  formHTML += `
        <fieldset name="reference">
          <legend>Reference Contact</legend>
          <div class="addExp">
            <button onclick="addReference()">ADD</button>
          </div>
          <table cellspacing="10">
            <tbody id="referenceTable">
            </tbody>
          </table>
        </fieldset>

        <div class="navigation">
            <span class="prev-btn" onclick="generateTechnologiesForm()">Prev</span>
            <span class="next-btn" onclick="handleReferenceFormSubmit()">Next</span>
        </div>
    `;

  root.innerHTML = formHTML;

  if (oldState?.reference?.length) {
    oldState.reference.forEach((obj) => {
      addReference(obj, 'disabled = "true"');
    });
  }
}

function generatePreferenceForm() {
  let formHTML = "";
  const root = document.getElementById("root");

  formHTML += `
        <fieldset name="preferences">
          <legend>Preference</legend>

          <table cellspacing="10">
              <tr>
                  <td>Prefered Location</td>
                  <td id="prefered_locationParent">
                  </td>
                  

                  <td>Notice Period</td>
                  <td>
                      <input type="text" name="notice_period_in_days" id="notice_period_in_days" class="notice"
                        ${
                          oldState?.basicDetails?.notice_period_in_days
                            ? `value = '${oldState?.basicDetails?.notice_period_in_days}'`
                            : ""
                        }
                      />
                  </td>
              </tr>

              <tr>
                  <td>Department</td>
                  <td id="departmentParent">
                  </td>

                  <td>Current CTC</td>
                  <td>
                      <input type="number" name="current_ctc" id="current_ctc" class="required" class="ctc"
                        ${
                          oldState?.basicDetails?.current_ctc
                            ? `value = '${oldState?.basicDetails?.current_ctc}'`
                            : ""
                        }
                      />
                  </td>
              </tr>

              <tr>
                  <td>Expected CTC</td>
                  <td>
                      <input type="number" name="expected_ctc" id="expected_ctc" class="required" class="ctc"
                        ${
                          oldState?.basicDetails?.expected_ctc
                            ? `value = '${oldState?.basicDetails?.expected_ctc}'`
                            : ""
                        }
                      />
                  </td>
              </tr>
          </table>
        </fieldset>

        <div class="navigation">
            <span class="prev-btn" onclick="generateReferenceForm()">Prev</span>
            <span class="next-btn" onclick="handlePreferenceFormSubmit()">Finish</span>
        </div>
    `;

  root.innerHTML = formHTML;

  generateCombo("Location", "prefered_location", {
    prefered_location: oldState?.basicDetails?.prefered_location,
  });

  generateCombo("Department", "department", {
    department: oldState?.basicDetails?.department,
  });
}

function addExperience(defaultValue = {}) {
  let tableBody = document.getElementById("experienceTable");
  let count =
    defaultValue.id ??
    (tableBody.children?.length
      ? +tableBody.lastElementChild?.id.split("e")[1] + 1
      : 1);

  let rowHTML = `
    <tr id="e${count}">
      <td>
          Company Name
      </td>
      <td>
          <input type="text" name="company_name" id="company_name"
            ${
              defaultValue.company_name
                ? `value = '${defaultValue.company_name}'`
                : ""
            }
          >
      </td>

      <td>
          Designation
      </td>
      <td id="designation${count}Parent">
      </td>

      <td>
          From
      </td>
      <td>
          <input type="text" name="f" id="f" class="date"
            ${defaultValue.f ? `value = '${defaultValue.f.split("T")[0]}'` : ""}
          >
      </td>

      <td>
          To
      </td>
      <td>
          <input type="text" name="t" id="t" class="date"
            ${defaultValue.t ? `value = '${defaultValue.t.split("T")[0]}'` : ""}
          >
      </td>

      ${
        defaultValue.id
          ? ""
          : ` 
        <td>
            <button onclick=removeExperience(event)>Clear</button>
        </td>
      `
      }

    </tr>
  `;

  tableBody.innerHTML += rowHTML;

  generateCombo("Designation", `designation${count}`, {
    [`designation${count}`]: defaultValue.designation || null,
  });
}

function removeExperience(e) {
  e.target.parentElement.parentElement.remove();
}

function addReference(defaultValue = {}, specialValue = null) {
  let tableBody = document.getElementById("referenceTable");
  let count =
    defaultValue?.eid + defaultValue?.phone ??
    (tableBody.children?.length
      ? +tableBody.lastElementChild?.id.split("e")[1] + 1
      : 1);

  let rowHTML = `
      <tr id="e${count}">
      <td>Name</td>
      <td>
          <input type="text" name="name" id="name" class="textOnly"
            ${
              defaultValue.name
                ? `value = '${defaultValue.name}' disabled="true"`
                : ""
            }
          >
      </td>

      <td>Contact Number</td>
      <td>
          <input type="text" name="phone" id="phone" class="phone"
            ${
              defaultValue.phone
                ? `value = '${defaultValue.phone}' disabled="true"`
                : ""
            }
          >
      </td>

      <td>Relation</td>
      <td id="relation${count}Parent">
      </td>

      ${
        defaultValue.eid
          ? ""
          : ` 
        <td>
            <button onclick=removeReference(event)>Clear</button>
        </td>
      `
      }
    </tr>
  `;

  tableBody.innerHTML += rowHTML;

  generateCombo(
    "Relation",
    `relation${count}`,
    {
      [`relation${count}`]: defaultValue.relation || null,
    },
    specialValue
  );
}

function removeReference(e) {
  e.target.parentElement.parentElement.remove();
}

async function getStates() {
  return await fetch("/job-application-form-step/states")
    .then((data) => data.json())
    .then((data) => data.message);
}

async function getCities() {
  return await fetch("/job-application-form-step/cities")
    .then((data) => data.json())
    .then((data) => data.message);
}

async function getCombo(name) {
  return await fetch("/job-application-form-step/combo/" + name)
    .then((data) => data.json())
    .then((data) => data.message);
}

function populateCities(id) {
  let cityHTML = cities
    .filter((o) => o.sid == id)
    .map(
      (e) => `
        <option
            value=${e.id}
            ${oldState?.basicDetails?.city == e.id ? "selected" : ""}
        >
            ${e.name}
        </option>
    `
    )
    .join("\n");

  document.getElementById("city").innerHTML = cityHTML;
}

async function handleBasicFormSubmit() {
  clearErrors();

  let data = {
    fname: document.getElementById("fname").value,
    lname: document.getElementById("lname").value,
    designation: document.getElementById("designation").value,
    addr1: document.getElementById("addr1").value,
    email: document.getElementById("email").value,
    addr2: document.getElementById("addr2").value,
    phone: document.getElementById("phone").value,
    state: document.getElementById("state").value,
    city: Number(document.getElementById("city").value),
    gender: Array.from(document.getElementsByName("gender")).find(
      (o) => o.checked
    )?.value,
    zip: document.getElementById("zip").value,
    relationship: document.getElementById("relationship").value,
    dob: document.getElementById("dob").value,
  };

  let validationResult = checkValidation(data, validation.basicDetails);

  if (validationResult.status == "error") {
    let field = document.getElementById(validationResult.field);

    let a = document.createElement("div");
    a.textContent = validationResult.message;
    field.parentElement.appendChild(a);
    field.classList.add("on");
  } else {
    //Proceed
    const urlencoded = new URLSearchParams();

    Object.entries(data).forEach((arr) => {
      urlencoded.append(arr[0], arr[1]);
    });

    if (oldState?.basicDetails?.id) {
      urlencoded.append("id", oldState?.basicDetails?.id);
    }

    let obj = await fetch("/job-application-form-step/candidate", {
      method: oldState?.basicDetails?.id ? "PUT" : "POST",
      body: urlencoded,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((data) => data.json());

    if (obj.status == "success") {
      oldState.basicDetails = {
        ...oldState.basicDetails,
        ...data,
        id: oldState?.basicDetails?.id ?? obj.message,
      };
      generateEducationForm();
    } else if (obj.status == "error") {
      let field = document.getElementById(obj.field);

      let a = document.createElement("div");
      a.textContent = obj.message;
      field.parentElement.appendChild(a);
      field.classList.add("on");
    } else {
      alert("Something went wrong!");
    }
  }
}

async function handleEducationFormSubmit() {
  clearErrors();

  let data = {
    ssc: {
      id: oldState.basicDetails.id,
      ssc_board: document.getElementById("ssc_board").value,
      ssc_passing_year: document.getElementById("ssc_passing_year").value,
      ssc_percentage: document.getElementById("ssc_percentage").value,
    },
    hsc: {
      id: oldState.basicDetails.id,
      hsc_board: document.getElementById("hsc_board").value,
      hsc_passing_year: document.getElementById("hsc_passing_year").value,
      hsc_percentage: document.getElementById("hsc_percentage").value,
    },
    bachelor: {
      id: oldState.basicDetails.id,
      bachelor_course: document.getElementById("bachelor_course").value,
      bachelor_university: document.getElementById("bachelor_university").value,
      bachelor_passing_year: document.getElementById("bachelor_passing_year")
        .value,
      bachelor_percentage: document.getElementById("bachelor_percentage").value,
    },
  };

  for (const key of Object.keys(data)) {
    if (data[key][key + "_percentage"] || data[key][key + "_passing_year"]) {
      let validationResult = checkValidation(
        data[key],
        validation.education[key]
      );

      if (validationResult.status == "error") {
        let field = document.getElementById(validationResult.field);

        let a = document.createElement("div");
        a.textContent = validationResult.message;
        field.parentElement.appendChild(a);
        field.classList.add("on");
        return;
      } else {
        //Proceed
        const urlencoded = new URLSearchParams();

        Object.entries(data[key]).forEach((arr) => {
          urlencoded.append(arr[0], arr[1]);
        });

        urlencoded.append("detail", key);

        let obj = await fetch("/job-application-form-step/education", {
          method: "PUT",
          body: urlencoded,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }).then((data) => data.json());

        if (obj.status == "error") {
          let field = document.getElementById(obj.field);

          let a = document.createElement("div");
          a.textContent = obj.message;
          field.parentElement.appendChild(a);
          field.classList.add("on");
          return;
        }
      }
    }
  }

  data.master = {
    eid: oldState.basicDetails.id,
    master_course: document.getElementById("master_course").value,
    master_university: document.getElementById("master_university").value,
    master_passing_year: document.getElementById("master_passing_year").value,
    master_percentage: document.getElementById("master_percentage").value,
  };

  if (data.master.master_passing_year || data.master.master_percentage) {
    const urlencoded = new URLSearchParams();

    Object.entries(data.master).forEach((arr) => {
      urlencoded.append(arr[0], arr[1]);
    });

    let obj = await fetch("/job-application-form-step/master", {
      method: oldState?.masterDetails?.master_course ? "PUT" : "POST",
      body: urlencoded,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((data) => data.json());

    if (obj.status == "status") {
      oldState.masterDetails = {
        master_course: data.master.master_course,
        master_university: data.master.master_university,
        master_passing_year: data.master.master_passing_year,
        master_percentage: data.master.master_percentage,
      };
    } else if (obj.status == "error") {
      let field = document.getElementById(obj.field);

      let a = document.createElement("div");
      a.textContent = obj.message;
      field.parentElement.appendChild(a);
      field.classList.add("on");
      return;
    }
  }

  oldState.basicDetails.ssc_board = data.ssc.ssc_board;
  oldState.basicDetails.ssc_passing_year = data.ssc.ssc_passing_year;
  oldState.basicDetails.ssc_percentage = data.ssc.ssc_percentage;

  oldState.basicDetails.hsc_board = data.hsc.hsc_board;
  oldState.basicDetails.hsc_passing_year = data.hsc.hsc_passing_year;
  oldState.basicDetails.hsc_percentage = data.hsc.hsc_percentage;

  oldState.basicDetails.bachelor_course = data.bachelor.bachelor_course;
  oldState.basicDetails.bachelor_university = data.bachelor.bachelor_university;
  oldState.basicDetails.bachelor_passing_year =
    data.bachelor.bachelor_passing_year;
  oldState.basicDetails.bachelor_percentage = data.bachelor.bachelor_percentage;
  generateExperienceForm();
}

async function handleWorkExperienceFormSubmit() {
  clearErrors();
  const existingIds = oldState?.experience?.map((e) => e.id);
  const newExperience = [];

  for (let trElement of document.querySelectorAll("#experienceTable tr")) {
    const expId = Number(trElement.id.split("e")[1]);

    let data = {
      eid: oldState?.basicDetails?.id,
      company_name: document.querySelector(
        `#experienceTable tr#${trElement.id} input#company_name`
      ).value,
      designation: document.querySelector(
        `#experienceTable tr#${trElement.id} select`
      ).value,
      f: document.querySelector(`#experienceTable tr#${trElement.id} input#f`)
        .value,
      t: document.querySelector(`#experienceTable tr#${trElement.id} input#t`)
        .value,
    };

    let validationResult = checkValidation(data, validation.experience);

    if (validationResult.status == "error") {
      let field;

      if (validationResult.field == "designation") {
        field = document.querySelector(
          `#experienceTable tr#${trElement.id} select`
        );
      } else {
        field = document.querySelector(
          `#experienceTable tr#${trElement.id} input#${validationResult.field}`
        );
      }

      let a = document.createElement("div");
      a.textContent = validationResult.message;
      field.parentElement.appendChild(a);
      field.classList.add("on");
      return;
    } else {
      const urlencoded = new URLSearchParams();

      Object.entries(data).forEach((arr) => {
        urlencoded.append(arr[0], arr[1]);
      });

      if (existingIds?.includes(expId)) urlencoded.append("id", expId);

      let response = await fetch("/job-application-form-step/experience", {
        method: existingIds?.includes(expId) ? "PUT" : "POST",
        body: urlencoded,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((data) => data.json());

      if (response.status == "error") {
        let field = document.getElementById(response.field);

        let a = document.createElement("div");
        a.textContent = response.message;
        field.parentElement.appendChild(a);
        field.classList.add("on");
        return;
      } else {
        newExperience.push({
          id: existingIds?.includes(expId) ? expId : response.message,
          eid: data.eid,
          company_name: data.company_name,
          designation: data.designation,
          f: data.f,
          t: data.t,
        });
      }
    }
  }

  if (newExperience.length) oldState.experience = newExperience;

  generateLanguagesForm();
}

async function handleLanguagesFormSubmit() {
  const existingIds = oldState?.language?.map((e) => [e.eid, e.option_id]);
  const newLanguages = [];

  for (let trElement of document.getElementsByName("language")) {
    if (trElement.checked) {
      let option_id = Number(trElement.value);
      let arr = Array.from(
        document.getElementsByName(`Proficiency${option_id}`)
      ).map((e) => (e.checked ? 1 : 0));

      let data = {
        eid: oldState?.basicDetails.id,
        option_id,
        read: arr[0],
        write: arr[1],
        speak: arr[2],
      };

      const urlencoded = new URLSearchParams();

      Object.entries(data).forEach((arr) => {
        urlencoded.append(arr[0], arr[1]);
      });

      let response = await fetch("/job-application-form-step/language", {
        method: existingIds?.some(
          ([eid, option_id]) => eid == data.eid && option_id == data.option_id
        )
          ? "PUT"
          : "POST",
        body: urlencoded,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((data) => data.json());

      if (response.status == "error") {
        alert(response.message);
        return;
      } else {
        newLanguages.push({ ...data });
      }
    }
    if (newLanguages.length) oldState.language = newLanguages;
  }
  generateTechnologiesForm();
}

async function handleTechnologiesFormSubmit() {
  const existingIds = oldState?.technologies?.map((e) => [e.eid, e.option_id]);
  const newTechnologies = [];

  for (let trElement of document.getElementsByName("technologies")) {
    if (trElement.checked) {
      let data = {
        eid: oldState?.basicDetails.id,
        option_id: Number(trElement.value),
        level: Array.from(
          document.getElementsByName(`Level${trElement.value}`)
        ).find((o) => o.checked).value,
      };

      const urlencoded = new URLSearchParams();

      Object.entries(data).forEach((arr) => {
        urlencoded.append(arr[0], arr[1]);
      });

      let response = await fetch("/job-application-form-step/technologies", {
        method: existingIds?.some(
          ([eid, option_id]) => eid == data.eid && option_id == data.option_id
        )
          ? "PUT"
          : "POST",
        body: urlencoded,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((data) => data.json());

      if (response.status == "error") {
        alert(response.message);
        return;
      } else {
        newTechnologies.push({ ...data });
      }
    }
    if (newTechnologies.length) oldState.technologies = newTechnologies;
  }

  generateReferenceForm();
}

async function handleReferenceFormSubmit() {
  clearErrors();
  const newReference = [];

  for (let trElement of document.querySelectorAll("#referenceTable tr")) {
    if (!trElement.children[1].firstElementChild.disabled) {
      const expId = Number(trElement.id.split("e")[1]);

      let data = {
        eid: oldState?.basicDetails?.id,
        name: document.querySelector(
          `#referenceTable tr#${trElement.id} input#name`
        ).value,
        phone: document.querySelector(
          `#referenceTable tr#${trElement.id} input#phone`
        ).value,
        relation: document.querySelector(
          `#referenceTable tr#${trElement.id} select`
        ).value,
      };

      let validationResult = checkValidation(data, validation.reference);

      if (validationResult.status == "error") {
        let field;

        if (validationResult.field == "relation") {
          field = document.querySelector(
            `#referenceTable tr#${trElement.id} select`
          );
        } else {
          field = document.querySelector(
            `#referenceTable tr#${trElement.id} input#${validationResult.field}`
          );
        }

        let a = document.createElement("div");
        a.textContent = validationResult.message;
        field.parentElement.appendChild(a);
        field.classList.add("on");
        return;
      } else {
        const urlencoded = new URLSearchParams();

        Object.entries(data).forEach((arr) => {
          urlencoded.append(arr[0], arr[1]);
        });

        let response = await fetch("/job-application-form-step/reference", {
          method: "POST",
          body: urlencoded,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }).then((data) => data.json());

        if (response.status == "error") {
          let field = document.getElementById(response.field);

          let a = document.createElement("div");
          a.textContent = response.message;
          field.parentElement.appendChild(a);
          field.classList.add("on");
          return;
        } else {
          newReference.push({ ...data });
        }
      }
    }
  }

  if (newReference.length) oldState.reference = newReference;

  generatePreferenceForm();
}

async function handlePreferenceFormSubmit() {
  clearErrors();

  let data = {
    id: oldState?.basicDetails.id,
    prefered_location: document.getElementById("prefered_location").value,
    department: document.getElementById("department").value,
    notice_period_in_days:
      document.getElementById("notice_period_in_days").value || 0,
    expected_ctc: document.getElementById("expected_ctc").value,
    current_ctc: document.getElementById("current_ctc").value,
  };

  let validationResult = checkValidation(data, validation.preference);

  if (validationResult.status == "error") {
    let field = document.getElementById(validationResult.field);

    let a = document.createElement("div");
    a.textContent = validationResult.message;
    field.parentElement.appendChild(a);
    field.classList.add("on");
  } else {
    //Proceed
    const urlencoded = new URLSearchParams();

    Object.entries(data).forEach((arr) => {
      urlencoded.append(arr[0], arr[1]);
    });

    let obj = await fetch("/job-application-form-step/preference", {
      method: "PUT",
      body: urlencoded,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((data) => data.json());

    if (obj.status == "success") {
      oldState.basicDetails = {
        ...oldState.basicDetails,
        ...data,
      };
      alert("Operation Completed Successfully");
      window.location = "/list";
    } else if (obj.status == "error") {
      let field = document.getElementById(obj.field);

      let a = document.createElement("div");
      a.textContent = obj.message;
      field.parentElement.appendChild(a);
      field.classList.add("on");
      return;
    }
  }
}

function clearErrors() {
  let field = document.querySelector(".on");
  field?.classList.remove("on");
  field?.parentElement.removeChild(field.parentElement.lastChild);
}

async function generateCombo(
  name,
  controlName,
  selectedValues,
  specialValue = ""
) {
  let s = "";
  const results = await getCombo(name);

  if (name == "Languages") {
    results.forEach((e) => {
      s += `
            <tr>
              <td>
                  <input type="checkbox" 
                      name="${controlName}" id="${
        controlName + e.opt_id
      }" value=${e.opt_id} disabled
                      ${
                        selectedValues[controlName]?.filter(
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
                          onclick="proficiencySelected(event, '${controlName}')"
                          ${
                            selectedValues[controlName]?.filter(
                              (obj) => obj.option_id == e.opt_id
                            )[0]?.read
                              ? 'checked disabled="true"'
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
                          onclick="proficiencySelected(event, '${controlName}')"
                          ${
                            selectedValues[controlName]?.filter(
                              (obj) => obj.option_id == e.opt_id
                            )[0]?.write
                              ? 'checked disabled="true"'
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
                          onclick="proficiencySelected(event, '${controlName}')"
                          ${
                            selectedValues[controlName]?.filter(
                              (obj) => obj.option_id == e.opt_id
                            )[0]?.speak
                              ? 'checked disabled="true"'
                              : ""
                          }
                      />
                          Speak
                  </label>
              </td>
            </tr>
        `;
    });
  } else if (name == "Technologies") {
    results.forEach((e) => {
      s += `
          <tr>
            <td>
                <input type="checkbox"
                    name="${controlName}" id="${
        controlName + e.opt_id
      }" value=${e.opt_id} disabled
                    ${
                      selectedValues[controlName]?.filter(
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
                    }" id="Level34" value="34"
                      ${
                        selectedValues[controlName]?.filter(
                          (obj) => obj.level == 34 && obj.option_id == e.opt_id
                        ).length > 0
                          ? "checked"
                          : ""
                      }
                      onclick="levelSelected(event, '${controlName}')"
                    />
                        Beginner
                </label>
                <label for="Level${e.opt_id}">
                    <input type="radio" name="Level${
                      e.opt_id
                    }" id="Level35" value="35"
                      ${
                        selectedValues[controlName]?.filter(
                          (obj) => obj.level == 35 && obj.option_id == e.opt_id
                        ).length > 0
                          ? "checked"
                          : ""
                      }
                      onclick="levelSelected(event, '${controlName}')"
                    />
                        Mediator
                </label>
                <label for="Level${e.opt_id}">
                    <input type="radio" name="Level${
                      e.opt_id
                    }" id="Level36" value="36"
                      ${
                        selectedValues[controlName]?.filter(
                          (obj) => obj.level == 36 && obj.option_id == e.opt_id
                        ).length > 0
                          ? "checked"
                          : ""
                      }
                      onclick="levelSelected(event, '${controlName}')"
                    />
                        Expert
                </label>
            </td>
          </tr>
        `;
    });
  } else {
    switch (results[0]?.control_type) {
      case "dropdown":
        s += `<select 
                        name="${controlName}"
                        id="${controlName}"
                        ${results[0].allow_multiple ? "multiple" : ""}
                        ${specialValue}
                >`;

        results.forEach((element) => {
          s += `
                        <option
                            value=${element.opt_id}
                            ${
                              selectedValues[controlName] == element.opt_id
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
                        name="${controlName}"
                        value="${e.opt_id}"
                        ${
                          selectedValues[controlName] == e.opt_id
                            ? "checked"
                            : ""
                        }
                    >
                            ${e.value}
                    </input>`;
        });
        break;
      default:
        break;
    }
  }

  document.getElementById(controlName + "Parent").innerHTML = s;
}

function proficiencySelected(e, controlName) {
  let optId = e.target.name.split("Proficiency")[1];
  let checked = Array.from(
    document.getElementsByName(`Proficiency${optId}`)
  ).some((o) => o.checked);
  document.querySelector(`#${controlName}${optId}`).checked = checked;
}

function levelSelected(e, controlName) {
  let optId = e.target.name.split("Level")[1];
  let checked = Array.from(document.getElementsByName(`Level${optId}`)).some(
    (o) => o.checked
  );
  document.querySelector(`#${controlName}${optId}`).checked = checked;
}

function checkValidation(body, validation) {
  for (let arr of Object.entries(validation)) {
    const field = arr[0];
    const obj = arr[1];
    if (obj.required) {
      if (!body[field]) {
        return {
          status: "error",
          field,
          message: `${field} is required!`,
        };
      }
    }

    // Note pattern is optional property
    if (obj?.pattern && body[field]) {
      if (!new RegExp(obj.pattern, "i").test(body[field])) {
        return {
          status: "error",
          field,
          message: `Invalid input for ${field}!`,
        };
      }
    }
  }
  return { status: "success" };
}
