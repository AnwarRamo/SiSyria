import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { AdminService } from '../../api/services/admin.service';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CalendarComponent() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AdminService.getAppointments();
        // Transform the data to match calendar format
        const transformedAppointments = response.map(event => ({
          ...event,
          start: new Date(event.start || event.date),
          end: new Date(event.end || event.date),
          title: event.title || 'Appointment'
        }));
        setAppointments(transformedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleSelect = async ({ start, end }) => {
    const title = prompt('New Event name');
    if (title) {
      const newEvent = { title, start, end };
      try {
        await AdminService.createAppointment(newEvent);
        setAppointments([...appointments, newEvent]);
      } catch (error) {
        console.error("Error creating appointment:", error);
      }
    }
  };

  if (loading) {
    return <div className="bg-white p-4 shadow-md rounded-md mb-4">Loading calendar...</div>;
  }

  if (error) {
    return <div className="bg-white p-4 shadow-md rounded-md mb-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-4 shadow-md rounded-md mb-4">
      <h2 className="text-xl font-semibold mb-4">Calendar</h2>
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={handleSelect}
      />
    </div>
  );
}

export default CalendarComponent;