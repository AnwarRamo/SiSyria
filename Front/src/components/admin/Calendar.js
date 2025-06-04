import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CalendarComponent() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Update the URL to include the correct route
        const response = await axios.get('http://localhost:5000/api/appointments');
        setAppointments(response.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const handleSelect = async ({ start, end }) => {
    const title = prompt('New Event name');
    if (title) {
      const newEvent = { title, start, end };
      try {
        // Update the URL to include the correct route
        await axios.post('http://localhost:5000/api/appointments', newEvent);
        setAppointments([...appointments, newEvent]);
      } catch (error) {
        console.error("Error creating appointment:", error);
      }
    }
  };

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