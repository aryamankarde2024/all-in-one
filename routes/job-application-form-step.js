import express from "express";
import {
  getCandidateDetails,
  getCities,
  getComboDetails,
  getStates,
  home,
  list,
  postCandidate,
  postExperience,
  postLanguage,
  postMaster,
  postReference,
  postTechnologies,
  putCandidate,
  putEducation,
  putExperience,
  putLanguage,
  putMaster,
  putReference,
  putTechnologies,
} from "../controllers/job-application-form-step.js";

const router = express.Router();

router.use(express.static("assets"));

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

router.post("/candidate", postCandidate);

router.put("/candidate", putCandidate);

router.put("/education", putEducation);

router.post("/master", postMaster);

router.put("/master", putMaster);

router.post("/experience", postExperience);

router.put("/experience", putExperience);

router.post("/language", postLanguage);

router.put("/language", putLanguage);

router.post("/technologies", postTechnologies);

router.put("/technologies", putTechnologies);

router.post("/reference", postReference);

router.put("/preference", putReference);

router.get("/combo/:name", getComboDetails);

router.get("/states", getStates);

router.get("/cities", getCities);

router.get("/list", list);

router.get("/", home);

router.get("/candidate/:id", getCandidateDetails);

export default router;
