import { questions } from "./questions.js";

export function wizard() {
  return {
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

    },
    finalData: null,
    pendingBranchKey: null,

    get current() {
      return questions[this.currentId];
    },

    get isFinal() {
      return this.currentId.startsWith("final");
    },

    next(nextId, confirmMessage = null, branchKey = null, mode = "confirm") {
      this.history.push(this.currentId);

      // Branch selection (store temporarily until user confirms)
      if (branchKey) {
        this.pendingBranchKey = branchKey;

        this.confirmBox = {
          visible: true,
          message: "Are you sure this is the branch you would like to visit?",
          nextId: nextId,
          mapUrl: this.branchMaps[branchKey],
          mode: "confirm"
        };
        return;
      }

      // Existing confirmation logic
      if (confirmMessage) {
        this.confirmBox = {
          visible: true,
          message: confirmMessage,
          nextId: nextId,
          mapUrl: null,
          mode
        };
        return;
      }

      // Move to next question
      this.currentId = nextId;

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
        name: "",
        email: "",
        phone: "",
        notes: "",
        adults: null,
        children: null,
        appointmentMode: "",
        ageCategory: "",
        appointmentType: "",
        branch: ""
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
          message: "We only allow one full try on per party. Please adjust your selection.",
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
          message: "Remeasures and Full Try Ons are only available if you have already been measured. Please confirm that you have been measured already.",
          nextId: "party_branch",
          mapUrl: null,
          mode: "confirm"
        };
      } else {
        this.next("party_branch");
      }
    },

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

    get partyTotalAdults() {
      return (
        this.form.partyAppointments.initial.adults +
        this.form.partyAppointments.remeasure.adults +
        this.form.partyAppointments.fullTryOn.adults
      );
    },

    get partyTotalChildren() {
      return (
        this.form.partyAppointments.initial.children +
        this.form.partyAppointments.remeasure.children +
        this.form.partyAppointments.fullTryOn.children
      );
    },

    get availableTimes() {
      if (!this.form.date || !this.form.branch) return [];

      const day = new Date(this.form.date).getDay(); // 0 = Sunday
      const branch = this.form.branch;

      let start, end;

      if (branch === "STE") {
        if (day === 0) {
          // Sunday
          start = "11:00";
          end = "15:30";
        } else {
          // Mon–Sat
          start = "09:30";
          end = "17:00";
        }
      }

      if (branch === "DUK") {
        // Duke Street is Mon–Sat only
        start = "09:30";
        end = "16:00";
      }

      return this.generateTimeSlots(start, end, 30);
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
    }
  };
}