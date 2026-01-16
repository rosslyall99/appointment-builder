export const questions = {
  
  // START PAGE //
  start: {
    id: "start",
    questionText: "Please select the type of appointment you require:",
    subtext: "<p>You can choose to either hire or purchase.</p><p>If you are interested in hire and purchase, please submit two separate enquiries.</p>",
    answers: [
      { label: "Hire", next: "hire_type", mode: "hire" },
      { label: "Purchase", next: "buy_start", mode: "buy" }
    ]
  },
  // HIRING PATH //

  // TYPE OF APPOINTMENT //
  hire_type: {
    id: "hire_type",
    questionText: "Please select the type of hire appointment you need.",
    subtext: "<p>A <b>consultation</b> is a 20 minute appointment where we discuss your requirements but no measurements are taken.</p><p>If you are choosing a <b>measurement</b> appointment, you will be given the option of choosing which type of measurement you require.</p>",
    answers: [
      { label: "Consultation", next: "branch_selection", hireType: "consultation" },
      { label: "Measurement", next: "measurement_quantity", hireType: "measurement" }
    ]
  },

  // HOW MANY PEOPLE NEED MEASURED //
  measurement_quantity: {
    id: "measurement_quantity",
    questionText: "Do you require an appointment for one person or a group of people?",
    subtext: "<p>There is no maximum number of people you can book for a measurement appointment.</p><p>But please be aware that we are very busy at the weekend, and can't always accomodate large groups.</p>",
    answers: [
      { label: "One person", next: "solo_age" },
      { label: "Group of people", next: "party_numbers" }
    ]
  },

  // SOLO APPOINTMENT PATH //
  solo_age: {
    id: "solo_age",
    questionText: "Is the appointment for an adult or a child?",
    subtext: "<p>Children are defined as under 14 years of age.</p><p>Our childrens hire prices are determined by the age of the child, not by the size of clothing they wear.</p>",
    answers: [
      { label: "Adult", next: "solo_type", age: "adult" },
      { label: "Child", next: "solo_type", age: "child" }
    ]
  },

  solo_type: {
    id: "solo_type",
    questionText: "Please select the type of hire appointment you require:",
    subtext: "<p>Please click the ℹ️ beside each option for a detailed description of what to expect at the appointment.</p>",
    answers: [
      {
        label: "Initial Measurement",
        next: "branch_selection",
        description: "A full measurement appointment for customers being fitted for the first time."
      },
      {
        label: "Remeasure",
        next: "branch_selection",
        description: "A quick appointment to update existing measurements.",
        requiresPreviousMeasurement: true
      },
      {
        label: "Full Try On",
        next: "branch_selection",
        description: "A complete outfit try on before collection or final adjustments.",
        requiresPreviousMeasurement: true
      }
    ]
  },

  branch_selection: {
    id: "branch_selection",
    questionText: "Which branch would you like to visit?",
    subtext: "<p>Please click the ℹ️ beside each option to view branch location.</p>",
    answers: [
      {
        label: "St Enoch Square",
        next: "date_time",
        branchId: "STE",
        description: `
          <p>Our St Enoch Square branch is located at…</p>
          <iframe
            src="https://www.google.com/maps?q=Slanj+Kilts+St+Enoch+Square+Glasgow&z=15&output=embed"
            width="100%"
            height="600"
            style="border:0;"
            allowfullscreen=""
            loading="lazy">
          </iframe>
        `
      },
      {
        label: "Duke Street",
        next: "date_time",
        branchId: "DUK",
        description: `
          <p>Our Duke Street branch is located at…</p>
          <iframe
            src="https://www.google.com/maps?q=Slanj+Kilts+Duke+Street+Glasgow&z=15&output=embed"
            width="100%"
            height="600"
            style="border:0;"
            allowfullscreen=""
            loading="lazy">
          </iframe>
        `
      }
    ]
  },

  date_time: {
    id: "date_time",
    type: "datetime",
    questionText: "Please choose your preferred appointment date and time",
    next: "final_branch"
  },

  final_branch: {
    id: "final_branch",
    questionText: "Please enter your details to complete your enquiry.",
    answers: []
  },

  // GROUP APPOINTMENT PATH //

  party_numbers: {
    id: "party_numbers",
    type: "multi-number",
    questionText: "How many people need measured?",
    fields: [
      { label: "Adults", model: "adults" },
      { label: "Children (under 14)", model: "children" }
    ],
    next: "party_type"
  },

  party_type: {
    id: "party_type",
    type: "custom-multi-number",
    questionText: "Which type of appointment would each person like?",
    next: "party_branch"
  },

  party_branch: {
    id: "party_branch",
    questionText: "Which branch would you like to visit?",
    answers: [
      { label: "City Centre", next: "date_time", branch: "STE" },
      { label: "East End", next: "date_time", branch: "DUK" }
    ]
  },

  date_time: {
    id: "date_time",
    type: "datetime",
    questionText: "Please choose your preferred appointment date and time",
    next: "final_branch"
  },

  // BUYING PATH //
  buy_start: {
    id: "buy_start",
    questionText: "How many people need measured for buying?",
    type: "number",
    model: "buyCount",
    next: "buy_items"
  },

  buy_items: {
    id: "buy_items",
    questionText: "What is each person buying?",
    type: "buy-multi",
    next: "branch_selection"
  }
};