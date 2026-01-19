export const questions = {
  
  // START PAGE //
  start: {
    id: "start",
    pageTitle: "Appointment Type",
    questionText: "Please select the type of appointment you require",
    subtext: "Hire, Purchase or a combination of both?",
    answers: [
      { label: "Hire", next: "hire_type", mode: "hire" },
      { label: "Purchase", next: "buy_start", mode: "buy" },
      { label: "Purchase & Hire", next: "buy_start", mode: "combo" }
    ]
  },
  // HIRING PATH //

  // TYPE OF APPOINTMENT //
  hire_type: {
    id: "hire_type",
    pageTitle: "Hire Appointment",
    questionText: "Please select the type of hire appointment you require",
    subtext: "Click the ℹ️ for a description of what each hire type involves.",
    answers: [
      { 
        label: "Consultation", 
        next: "branch_selection", 
        hireType: "consultation", 
        description: "<p>A Consultation is a 20-minute appointment where you can explore our outfit options, compare tartans, discuss prices,and get guidance from our team.</p><p>You’ll browse jacket styles, tartans, shoes, and accessories, and ask any questions about building your ideal look.</p><p>This session is mainly for choosing your style, so trying items on isn’t guaranteed. If time allows, a quick measurement may be offered, but accurate sizing is done during a dedicated <strong>Kilt Measurement</strong> appointment.</p><p>After that, we can arrange a <strong>Full Try On</strong> so you can try the full outfit in your chosen tartan and size.</p>"
      },
      { 
        label: "Measurement", 
        next: "measurement_quantity", 
        hireType: "measurement",
        description: "<p>A Measurement appointment is focused on taking the accurate sizes needed for your kilt hire outfit.</p><p>You’ll be able to choose from three types of appointment — an <strong>Initial Measurement</strong>, a <strong>Remeasure</strong>, or a <strong>Full Try On</strong> — depending on what stage you’re at.</p><p>On the next two pages, you’ll see a full description of each option so you can select the one that suits you best.</p>"
      }
    ]
  },

  // HOW MANY PEOPLE NEED MEASURED //
  measurement_quantity: {
    id: "measurement_quantity",
    pageTitle: "Measurement Quantity",
    questionText: "How many people do you require measured?",
    subtext: "There is no maximum number for group measurement appointments.",
    answers: [
      { label: "One person", next: "solo_age" },
      { label: "Group of people", next: "party_numbers" }
    ]
  },

  // SOLO APPOINTMENT PATH //
  solo_age: {
    id: "solo_age",
    pageTitle: "Adult or Child?",
    questionText: "Is the appointment for an adult or a child?",
    subtext: "<p>Click the ℹ️ for our definition of an adult and a child.</p>",
    answers: [
      { 
        label: "Adult", 
        next: "solo_type", 
        age: "adult",
        description: "Adults are defined as 14 years of age and over."},
      { label: "Child", 
        next: "solo_type", 
        age: "child", 
        description: "Children are defined as under 14 years of age.</p><p>Our childrens hire prices are determined by the age of the child, not by the size of clothing they wear.</p>" }
    ]
  },

  solo_type: {
    id: "solo_type",
    pageTitle: "Hire Appointment Type",
    questionText: "Please select the type of hire appointment you require:",
    subtext: "<p>Please click the ℹ️ beside each option for a detailed description of what to expect at the appointment.</p>",
    answers: [
      {
        label: "Initial Measurement",
        next: "branch_selection",
        description: "<p>A Kilt Measurement appointment is focused on gathering the accurate sizes needed for your outfit. You won’t be trying on the full ensemble at this stage — this session is purely for fitting and confirming your measurements.</p><p>During your appointment, we’ll size your kilt using a sample garment, fit a jacket and waistcoat to determine the best match, and check your shoe size. These items may not reflect your final tartan, colour, or style — they’re used only to ensure an accurate fit.</p><p>If you’d like to see the full outfit together, we can arrange a separate <strong>Full Try On</strong> once your measurements have been taken. This allows us to prepare the correct sizes and your chosen tartan in advance.</p>"
      },
      {
        label: "Remeasure",
        next: "branch_selection",
        description: "<p>A Remeasure appointment is designed to double‑check your measurements and ensure your hire outfit will fit comfortably and correctly for your event. You won’t be trying on the full outfit at this stage — this session is focused solely on confirming sizing.</p><p>During your fitting, we’ll remeasure you using our standard process. You’ll be sized for your kilt using a sample garment, try on a jacket and waistcoat to confirm fit, and check your shoe size. These items may not match your final tartan, colour, or style — they’re used only to verify accurate measurements.</p><p>  If you’d prefer to try on the full outfit during this visit, we can convert your booking into a <strong>Full Try On</strong> appointment. Just reply to your confirmation email and we’ll update it for you.</p>.",
        requiresPreviousMeasurement: true
      },
      {
        label: "Full Try On",
        next: "branch_selection",
        description: "<p>  A Full Try On appointment lets you try on the complete outfit exactly as you’ll wear it on the day of your event. It’s the ideal way to see how everything looks and feels together and to make sure the fit is just right.</p><p>This service is only available once you’ve already had an <strong>Initial Measurement</strong> appointment, as we use your confirmed sizes to prepare the correct items in advance.</p><p>  During your visit, you’ll try on the full outfit — including your kilt, jacket and waistcoat, shirt, shoes, and accessories — and we’ll check the fit and make any adjustments needed.</p><p>If this is your first visit to Slanj, please select <strong>Initial Measurement</strong> instead.</p>",
        requiresPreviousMeasurement: true
      }
    ]
  },

  branch_selection: {
    id: "branch_selection",
    pageTitle: "Branch Selection",
    questionText: "Which branch would you like to visit?",
    subtext: "Click the ℹ️ beside each option to view branch location.",
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
            height="400"
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
            height="400"
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
    pageTitle: "Appointment Date & Time",
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
    pageTitle: "Measurement Quantity",
    type: "multi-number",
    questionText: "How many adults and children need measured?",
    subtext: "Please select the number of adults and children in your group.",
    fields: [
      { 
        label: "Adults", 
        model: "adults",
        description: "Adults are defined as 14 years of age and over."},
      { 
        label: "Children",
        model: "children",
        description: "Children are defined as under 14 years of age.</p><p>Our childrens hire prices are determined by the age of the child, not by the size of clothing they wear." }
    ],
    next: "party_type"
  },

  party_type: {
    id: "party_type",
    pageTitle: "Hire Appointment Types",
    type: "custom-multi-number",
    questionText: "Please choose an appointment for each person.",
    subtext: "The numbers must match the numbers in your group.",
    next: "party_branch"
  },

  party_branch: {
    id: "party_branch",
    pageTitle: "Branch Selection",
    questionText: "Which branch would you like to visit?",
    subtext: "Click the ℹ️ beside each option to view branch location.",
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
            height="400"
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
            height="400"
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
    pageTitle: "Appointment Date & Time",
    type: "datetime",
    questionText: "Please select preferred appointment date and time",
    subtext: "Our Duke Street store is closed on Sundays. Last appointment is 30 minutes before closing time.",
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