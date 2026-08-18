import { fetchPublic } from './apiClient';

// --- Clinic Data ---
export const getClinicInfo = () => fetchPublic('/clinic');
export const getWorkingHours = () => fetchPublic('/working-hours');

// --- Services ---
export const getServices = () => fetchPublic('/services');

// --- Blogs ---
export const getBlogs = () => fetchPublic('/blogs');

// --- Gallery ---
export const getGallery = () => fetchPublic('/gallery');

// --- Testimonials ---
export const getTestimonials = () => fetchPublic('/testimonials');

// --- Appointments & Contact (Public POST endpoints) ---
export const bookAppointment = (appointmentDetails: any) => 
  fetchPublic('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentDetails),
  });

export const submitContact = (contactDetails: any) =>
  fetchPublic('/contact', {
    method: 'POST',
    body: JSON.stringify(contactDetails),
  });
