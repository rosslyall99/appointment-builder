import { questions } from "./questions.js";

export function wizard() {
  return {

    /* -------------------------------------------------------
     * STATE
     * ----------------------------------------------------- */
    currentId: "start",
    history: [],

    form: {
      appointmentMode: "",
      hireType: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
      adults: 0,
      children: 0,
      ageCategory: "",
      appointmentType: "",
      branch: "",
      partyAppointments: {
        initial: { adults: 0, children: 0 },
        remeasure: { adults: 0, children: 0 },
        fullTryOn: { adults: 0, children: 0 }
      },
      date: "",
      time: "",
      buyCount: 1,
      buyItems: []
    },

    finalData: null,
    pendingBranchKey: null,
    formSubmitted: false,

    confirmBox: {
      visible: false,
      message: "",
      nextId: null,
      mapUrl: null,
      mode: "confirm"
    },

    /* -------------------------------------------------------
     * GETTERS
     * ----------------------------------------------------- */
    get current() {
      return questions[this.currentId];
    },

    get isFinal() {
      return this.currentId.startsWith("final");
    },

    get partyAppointmentsMatch() {
      const totalAdults =
        this.form.partyAppointments.initial.adults +
        this.form.partyAppointments.remeasure.adults +
        this.form.partyAppointments.fullTryOn.adults;

      const totalChildren =
        this.form.partyAppointments.initial.children +
        this.form.partyAppointments.remeasure.children +
        this.form.partyAppointments.fullTryOn.children;

      return (
        totalAdults === this.form.adults &&
        totalChildren === this.form.children
      );
    },

    get availableTimes() {
      if (!this.form.date || !this.form.branch) return [];

      const day = new Date(this.form.date).getDay(); // 0 = Sunday
      const branch = this.form.branch;

      let start, end;

      if (branch === "STE") {
        if (day === 0) {
          start = "11:00";
          end = "15:30";
        } else {
          start = "09:30";
          end = "17:00";
        }
      }

    if (branch === "DUK") {
      // Sunday = 0
      if (day === 0) {
        return []; // No times on Sunday
      }

        start = "09:30";
        end = "16:00";
      }


      return this.generateTimeSlots(start, end, 15);
    },

    get selectedDay() {
      if (!this.form.date) return null;
      return new Date(this.form.date).getDay(); // 0 = Sunday
    },

    get dateTimeComplete() {
      // Must have a date
      if (!this.form.date) return false;

      // If Duke St on Sunday → invalid, even if time is selected
      const day = new Date(this.form.date).getDay();
      if (this.form.branch === "DUK" && day === 0) return false;

      // Must have a time AND availableTimes must not be empty
      return this.form.time && this.availableTimes.length > 0;
    },

    get isDukeSunday() {
      if (!this.form.date || this.form.branch !== "DUK") return false;
      const day = new Date(this.form.date).getDay();
      return day === 0;
    },

    get finalFormComplete() {
      return (
        this.form.name?.trim().length > 0 &&
        this.form.email?.trim().length > 0 &&
        this.form.phone?.trim().length > 0
      );
    },

    resetFormAndStart() {
      this.formSubmitted = false;
      this.history = [];
      this.currentId = "start";   // ← this is the correct reset

      this.form = {
        appointmentMode: "",
        hireType: "",
        name: "",
        email: "",
        phone: "",
        notes: "",
        adults: 0,
        children: 0,
        ageCategory: "",
        appointmentType: "",
        branch: "",
        partyAppointments: {
          initial: { adults: 0, children: 0 },
          remeasure: { adults: 0, children: 0 },
          fullTryOn: { adults: 0, children: 0 }
        },
        date: "",
        time: "",
        buyCount: 1,
        buyItems: []
      };
    },

    /* -------------------------------------------------------
     * CORE LOGIC
     * ----------------------------------------------------- */

    handleAnswer(answer) {
      // Store any data the answer carries
      this.captureAnswerData(answer);

      // 1. Consultation confirmation
      if (answer.hireType === "consultation") {
        this.next(
          answer.next,
          "<p>This appointment is a consultation only, focused on giving you an overview of what we offer and helping you explore the different outfit styles, tartans, and options available.</p><p>No measurements will be taken during this session — it’s simply an opportunity to discuss your requirements, ask questions, and get guidance from our team before moving on to the next stage.</p><p>Please confirm that you are happy to proceed.</p>", "confirm"
        );
        return;
      }

      // 2. Remeasure / Full Try‑On confirmation (reinstated behaviour)
      if (answer.requiresPreviousMeasurement) {
        this.next(
          answer.next,
          "This service is only available if you have already been measured. Please confirm that you have been measured already.", "confirm"
        );
        return;
      }

      // 3. Legacy confirm flag (if you still use it anywhere)
      if (answer.confirm) {
        this.next(
          answer.next,
          "This service is only available if you have already been measured. Please confirm that you have been measured already.", "confirm"
        );
        return;
      }

      // 4. Normal navigation
      this.next(answer.next);
    },

    captureAnswerData(answer) {
      if (answer.mode) {
        this.form.appointmentMode = answer.mode;

        if (answer.mode === "combo") {
          this.form.appointmentType = "combo";
        }
      }

      if (answer.hireType) this.form.hireType = answer.hireType;
      if (answer.age) this.form.ageCategory = answer.age;
      if (answer.type) this.form.appointmentType = answer.type;

      // Support BOTH branchSelection and partyBranch
      if (answer.branchId) {
        this.form.branch = answer.branchId;
      }

      if (answer.branch) {
        this.form.branch = answer.branch;
      }
    },

    next(nextId, confirmMessage = null, mode = "confirm") {
      this.history.push(this.currentId);

      // Confirmation modal (remeasure / FTO)
      if (confirmMessage) {
        this.confirmBox = {
          visible: true,
          message: confirmMessage,
          nextId,
          mapUrl: null,
          mode
        };
        return;
      }

      // 🔀 COMBO MODE FLOW OVERRIDES
      if (this.form.appointmentMode === "combo") {
        if (this.currentId === "buy_items") {
          nextId = "hire_type"; // or whatever your hire flow starts with
        }
      }

      // Normal navigation
      this.currentId = nextId;
      if (nextId === "buy_items") {
        this.initBuyItems();
      }
    },

    back() {
      if (this.history.length === 0) return;
      this.currentId = this.history.pop();
    },

    restart() {
      this.currentId = "start";
      this.history = [];
      this.form = {
        appointmentMode: "",
        hireType: "",
        appointmentType: "",
        name: "",
        email: "",
        phone: "",
        notes: "",
        adults: 0,
        children: 0,
        ageCategory: "",
        branch: "",
        partyAppointments: {
          initial: { adults: 0, children: 0 },
          remeasure: { adults: 0, children: 0 },
          fullTryOn: { adults: 0, children: 0 }
        },
        date: "",
        time: ""
      };
      this.finalData = null;
    },

    async submitForm() {
      try {
        const response = await fetch(
          "https://obibnblucftyzbtzequj.functions.supabase.co/send-appointment-enquiry",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.form)
          }
        );

        if (!response.ok) throw new Error("Failed to send enquiry");

        // Show success message
        this.formSubmitted = true;

      } catch (error) {
        console.error(error);
        alert("There was a problem sending your enquiry. Please try again.");
      }
    },

    confirmYes() {
      this.confirmBox.visible = false;

      // Move forward WITHOUT pushing history again
      this.currentId = this.confirmBox.nextId;

      if (this.currentId === "buy_items") {
        this.initBuyItems();
      }
    },

    confirmNo() {
      this.confirmBox.visible = false;
    },

    checkFullTryOnLimit(group) {
      const value = this.form.partyAppointments.fullTryOn[group];
      if (value > 1) {
        this.confirmBox = {
          visible: true,
          message:
            "We only allow one full try on per party. Please adjust your selection.",
          nextId: null,
          mapUrl: null,
          mode: "alert"
        };
        this.form.partyAppointments.fullTryOn[group] = 1;
      }
    },

    handlePartyNext() {
      const remeasureTotal =
        this.form.partyAppointments.remeasure.adults +
        this.form.partyAppointments.remeasure.children;

      const fullTryTotal =
        this.form.partyAppointments.fullTryOn.adults +
        this.form.partyAppointments.fullTryOn.children;

      if (remeasureTotal > 0 || fullTryTotal > 0) {
        this.confirmBox = {
          visible: true,
          message:
            "Remeasures and Full Try Ons are only available if you have already been measured. Please confirm that you have been measured already.",
          nextId: "party_branch",
          mapUrl: null,
          mode: "confirm"
        };
      } else {
        this.next("party_branch");
      }
    },

    generateTimeSlots(start, end, interval) {
      const slots = [];
      let [h, m] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);

      while (h < endH || (h === endH && m <= endM)) {
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        slots.push(`${hh}:${mm}`);

        m += interval;
        if (m >= 60) {
          m -= 60;
          h++;
        }
      }

      return slots;
    },

    ensureBuyItem(index) {
      if (!this.form.buyItems[index]) {
        this.form.buyItems[index] = { type: "", details: "" };
      }
    },

    get buyItemsComplete() {
      if (!this.form.buyItems || this.form.buyItems.length < this.form.buyCount) return false;

      return this.form.buyItems.every(item => {
        if (!item.type) return false;
        if (item.type === "other" && !item.details) return false;
        return true;
      });
    },

    initBuyItems() {
      this.form.buyItems = Array.from({ length: this.form.buyCount }, () => ({
        type: "",
        details: ""
      }));
    },

    infoModal: {
      visible: false,
      title: "",
      html: ""
    },

    showInfo(answer) {
      this.infoModal.title = answer.label;
      this.infoModal.html = answer.description || "No additional information available.";
      this.infoModal.visible = true;
    }

  };
}