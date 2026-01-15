export const questions = {
  
  // START PAGE //
  start: {
    id: "start",
    questionText: "Are you interested in buying or hiring?",
    answers: [
      { label: "Hiring", next: "hire_type", mode: "hire" },
      { label: "Buying", next: "buy_start", mode: "buy" }
    ]
  },
  // HIRING PATH //

  // TYPE OF APPOINTMENT //
  hire_type: {
    id: "hire_type",
    questionText: "What type of appointment do you require?",
    answers: [
      { label: "Consultation", next: "branch_selection", hireType: "consultation" },
      { label: "Measurement Appointment", next: "measurement_quantity", hireType: "measurement" }
    ]
  },

  // HOW MANY PEOPLE NEED MEASURED //
  measurement_quantity: {
    id: "measurement_quantity",
    questionText: "Do you require an appointment for one person or a group of people?",
    answers: [
      { label: "One person", next: "solo_age" },
      { label: "Group of people", next: "party_numbers" }
    ]
  },

  // SOLO APPOINTMENT PATH //
  solo_age: {
    id: "solo_age",
    questionText: "Is the appointment for an adult or a child (under 14)?",
    answers: [
      { label: "Adult", next: "solo_type", age: "adult" },
      { label: "Child", next: "solo_type", age: "child" }
    ]
  },

  solo_type: {
    id: "solo_type",
    questionText: "Which type of appointment would you like",
    answers: [
      { label: "Initial Measurement", next: "branch_selection", type: "initial" },
      { label: "Remeasure", next: "branch_selection", type: "remeasure", confirm: true },
      { label: "Full Try On", next: "branch_selection", type: "full_try_on", confirm: true }
    ]
  },

  branch_selection: {
    id: "branch_selection",
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