// Export all services from a single entry point
export { authService } from './auth';
export { petsService } from './pets';
export { vetsService } from './vets';
export { appointmentsService } from './appointments';
export { symptomsService } from './symptoms';
export { resourcesService } from './resources';
export { adminService } from './admin';

// Re-export default exports
export { default as auth } from './auth';
export { default as pets } from './pets';
export { default as vets } from './vets';
export { default as appointments } from './appointments';
export { default as symptoms } from './symptoms';
export { default as resources } from './resources';
export { default as admin } from './admin';
