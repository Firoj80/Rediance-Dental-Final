# Headless API Documentation

This document outlines the API endpoints available in the backend. You can use this as a reference when building your new frontend application.

## General Information

### Base URL
In local development, the base URL for the API is `http://localhost:3000/api` (or whichever port you run it on). 
In production, it will be the domain where you host this backend (e.g., `https://api.yourdomain.com/api`).

### Authentication
Endpoints under the `/api/admin/*` route require authentication. You must include a Bearer token in the request headers:
```http
Authorization: Bearer <your_jwt_token>
```
To obtain a token, authenticate via the `/api/auth` endpoint.

### Content-Type
When sending data (POST, PUT, PATCH), ensure you set the `Content-Type` header:
```http
Content-Type: application/json
```

---

## Public Endpoints
These endpoints are accessible to anyone (e.g., visitors to the clinic's public website).

### Clinic & General Info
- `GET /api/clinic` - Fetch general clinic details (name, phone, address, etc.).
- `GET /api/working-hours` - Fetch the clinic's normal operating hours.
- `GET /api/blocked-dates` - Fetch any days the clinic is closed or fully booked.

### Services
- `GET /api/services` - Fetch a list of all dental services offered.
- `GET /api/services/[slug]` - Fetch details of a specific service by its slug.

### Appointments
- `POST /api/appointments` - Submit a new appointment request.
- `GET /api/appointments/availability` - Fetch available time slots for a specific date.
- `GET /api/appointments/[id]` - Fetch the status/details of a specific appointment by ID.

### Content & Media
- `GET /api/blogs` - Fetch published blog posts.
- `GET /api/blogs/[slug]` - Fetch a specific blog post by its slug.
- `GET /api/gallery` - Fetch images from the clinic's gallery.
- `GET /api/testimonials` - Fetch patient testimonials.

### Contact
- `POST /api/contact` - Submit a contact form inquiry.

---

## Admin Endpoints (Protected)
These endpoints require an Authentication token and are intended for the administrative dashboard.

### Dashboard & Settings
- `GET /api/admin/dashboard` - Fetch aggregate stats for the admin dashboard overview.
- `GET /PUT /api/admin/settings` - View or update core clinic settings.
- `GET /PUT /api/admin/clinic` - View or update clinic contact/location details.

### Appointments Management
- `GET /api/admin/appointments` - Fetch all appointments (often with filtering/pagination).
- `GET /PUT /DELETE /api/admin/appointments/[id]` - Manage a specific appointment (approve, reschedule, cancel).
- `GET /POST /api/admin/blocked-dates` - Manage blocked dates/holidays.

### Content Management
- `GET /POST /api/admin/services` - List or create new services.
- `PUT /DELETE /api/admin/services/[id]` - Edit or delete a service.
- `GET /POST /api/admin/blogs` - List or create new blog posts.
- `PUT /DELETE /api/admin/blogs/[id]` - Edit or delete a blog post.
- `GET /POST /api/admin/gallery` - List or upload new gallery images.
- `DELETE /api/admin/gallery/[id]` - Delete a gallery image.
- `GET /POST /api/admin/testimonials` - List or create new testimonials.
- `PUT /DELETE /api/admin/testimonials/[id]` - Edit or delete a testimonial.

### Inquiries
- `GET /api/admin/contact` - Fetch contact form submissions.
- `GET /DELETE /api/admin/contact/[id]` - View or delete a specific contact submission.

---

## Example Fetch Request (Frontend)

Here is a standard example of how you might call one of these endpoints from your new frontend using `fetch`:

```javascript
// Fetching Public Data
async function getServices() {
  const response = await fetch('http://localhost:3000/api/services');
  const data = await response.json();
  return data;
}

// Submitting Data (e.g. Booking an Appointment)
async function bookAppointment(appointmentDetails) {
  const response = await fetch('http://localhost:3000/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentDetails)
  });
  
  if (!response.ok) throw new Error('Failed to book');
  return await response.json();
}
```
