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

    confirmBox: {
      visible: false,
      message: "",
      nextId: null,
      mapUrl: null,
      mode: "confirm"
    },

    branchMaps: {
      STE: "https://www.google.com/maps?q=Slanj+Kilts+St+Enoch+Square+Glasgow&z=15&output=embed",
      DUK: "https://www.google.com/maps?q=Slanj+Kilts+Duke+Street+Glasgow&z=15&output=embed"
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
        start = "09:30";
        end = "16:00";
      }

      return this.generateTimeSlots(start, end, 30);
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
          "This appointment is a consultation only. No measurements will be taken — it is simply to show you what we offer.",
          null,
          "confirm"
        );
        return;
      }

      // 2. Branch selection → map modal
      if (answer.branch) {
        this.next(
          answer.next,
          null,
          answer.branch,
          "confirm"
        );
        return;
      }

      // 3. Remeasure / Full Try‑On confirmation (reinstated behaviour)
      if (answer.requiresPreviousMeasurement) {
        this.next(
          answer.next,
          "This service is only available if you have already been measured. Please confirm that you have been measured already.",
          null,
          "confirm"
        );
        return;
      }

      // 4. Legacy confirm flag (if you still use it anywhere)
      if (answer.confirm) {
        this.next(
          answer.next,
          "This service is only available if you have already been measured. Please confirm that you have been measured already.",
          null,
          "confirm"
        );
        return;
      }

      // 5. Normal navigation
      this.next(answer.next);
    },

    captureAnswerData(answer) {
      if (answer.mode) this.form.appointmentMode = answer.mode;
      if (answer.hireType) this.form.hireType = answer.hireType;
      if (answer.age) this.form.ageCategory = answer.age;
      if (answer.type) this.form.appointmentType = answer.type;
      if (answer.branch) this.form.branch = answer.branch;
    },

    next(nextId, confirmMessage = null, branchKey = null, mode = "confirm") {
      this.history.push(this.currentId);

      // Branch selection modal
      if (branchKey) {
        this.pendingBranchKey = branchKey;

        this.confirmBox = {
          visible: true,
          message: "Are you sure this is the branch you would like to visit?",
          nextId,
          mapUrl: this.branchMaps[branchKey],
          mode: "confirm"
        };
        return;
      }

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

      // Normal navigation
      this.currentId = nextId;
      if (nextId === "buy_items") {
        this.initBuyItems();
      }

      if (this.isFinal) {
        this.finalData = {
          title: "Appointment Type",
          description: "This is a placeholder description for " + nextId
        };
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

    submitForm() {
      alert("Enquiry submitted!");
      this.restart();
    },

    confirmYes() {
      this.confirmBox.visible = false;

      // If this was a branch selection, save it
      if (this.pendingBranchKey) {
        this.form.branch = this.pendingBranchKey;
        this.pendingBranchKey = null;
      }

      this.next(this.confirmBox.nextId);
    },

    confirmNo() {
      this.confirmBox.visible = false;
      this.history.pop();
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

        alert("Your enquiry has been sent!");
        this.restart();

      } catch (error) {
        console.error(error);
        alert("There was a problem sending your enquiry. Please try again.");
      }
    },

    infoModal: {
      visible: false,
      title: "",
      text: ""
    },

    showInfo(answer) {
      this.infoModal.title = answer.label;
      this.infoModal.text = answer.description || "No additional information available.";
      this.infoModal.visible = true;
    },

  };
}