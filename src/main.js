import { wizard } from './wizard.js';
window.appointmentWizard = wizard();

Alpine.data("appointmentWizard", wizard);
Alpine.start();