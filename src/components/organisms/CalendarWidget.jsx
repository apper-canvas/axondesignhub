import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import { appointmentService } from "@/services/api/appointmentService";
import { projectService } from "@/services/api/projectService";
import { clientService } from "@/services/api/clientService";
import React from 'react';
const CalendarWidget = ({ clientId = null, isPortal = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'appointment',
    clientId: clientId || '',
    time: '09:00'
  });

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, clientId]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, projectsData] = await Promise.all([
        appointmentService.getAll(),
        clientId ? projectService.getByClientId(clientId) : projectService.getAll()
      ]);

      setAppointments(appointmentsData);
      setProjects(projectsData);
      
      // Combine appointments and project milestones into events
      const combinedEvents = [
        ...appointmentsData.map(apt => ({
          ...apt,
          type: 'appointment',
          date: apt.date,
          color: 'bg-blue-500'
        })),
        ...projectsData.map(project => ({
          Id: `project-${project.Id}`,
          title: `${project.name} - Target Date`,
          description: project.description,
          date: project.targetDate,
          type: 'milestone',
          projectId: project.Id,
          clientId: project.clientId,
          color: getProjectPhaseColor(project.phase)
        }))
      ];

      setEvents(combinedEvents);
    } catch (error) {
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const getProjectPhaseColor = (phase) => {
    const colors = {
      consultation: 'bg-yellow-500',
      concept: 'bg-blue-500',
      design: 'bg-purple-500',
      procurement: 'bg-orange-500',
      installation: 'bg-green-500',
      completed: 'bg-gray-500'
    };
    return colors[phase] || 'bg-gray-500';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.date), date)
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventForm(prev => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd')
    }));
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(parseISO(event.date));
    setEventForm({
      title: event.title,
      description: event.description || '',
      type: event.type,
      clientId: event.clientId || '',
      time: event.time || '09:00',
      date: format(parseISO(event.date), 'yyyy-MM-dd')
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    try {
      const eventData = {
        ...eventForm,
        date: `${eventForm.date}T${eventForm.time}:00Z`,
        clientId: parseInt(eventForm.clientId) || null
      };

      if (selectedEvent && selectedEvent.type === 'appointment') {
        await appointmentService.update(selectedEvent.Id, eventData);
        toast.success("Appointment updated successfully");
      } else if (!selectedEvent && eventForm.type === 'appointment') {
        await appointmentService.create(eventData);
        toast.success("Appointment created successfully");
      }

      setShowEventModal(false);
      setSelectedEvent(null);
      setEventForm({
        title: '',
        description: '',
        type: 'appointment',
        clientId: clientId || '',
        time: '09:00'
      });
      loadCalendarData();
    } catch (error) {
      toast.error("Failed to save event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      if (selectedEvent.type === 'appointment') {
        await appointmentService.delete(selectedEvent.Id);
        toast.success("Appointment deleted successfully");
      }
      
      setShowEventModal(false);
      setSelectedEvent(null);
      loadCalendarData();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

// EventModal component moved outside to prevent re-rendering on form changes
const EventModal = React.memo(({ 
  showEventModal, 
  setShowEventModal, 
  selectedEvent, 
  eventForm, 
  setEventForm, 
  handleSaveEvent, 
  handleDeleteEvent 
}) => (
  <AnimatePresence>
    {showEventModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEventModal(false);
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedEvent ? 'Edit Event' : 'New Event'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEventModal(false)}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div onClick={(e) => e.stopPropagation()}>
              <Input
                label="Title"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Event title"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={eventForm.type}
                onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value }))}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={selectedEvent && selectedEvent.type === 'milestone'}
              >
                <option value="appointment">Appointment</option>
                <option value="milestone">Project Milestone</option>
              </select>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <Input
                label="Date"
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <Input
                label="Time"
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                onClick={(e) => e.stopPropagation()}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Event description"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveEvent}
                disabled={!eventForm.title}
                className="flex-1"
              >
                {selectedEvent ? 'Update' : 'Create'}
              </Button>
              
              {selectedEvent && selectedEvent.type === 'appointment' && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteEvent}
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
), (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.showEventModal === nextProps.showEventModal &&
    prevProps.selectedEvent === nextProps.selectedEvent &&
    prevProps.eventForm.title === nextProps.eventForm.title &&
    prevProps.eventForm.type === nextProps.eventForm.type &&
    prevProps.eventForm.date === nextProps.eventForm.date &&
    prevProps.eventForm.time === nextProps.eventForm.time &&
    prevProps.eventForm.description === nextProps.eventForm.description
  );
});

  if (loading) {
    return (
      <Card className="p-6">
        <Loading />
      </Card>
    );
  }

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="text-white hover:bg-white/20"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    min-h-[80px] p-1 border border-gray-100 cursor-pointer transition-colors
                    ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                    ${isDayToday ? 'ring-2 ring-primary' : ''}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isDayToday ? 'text-primary font-bold' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <motion.div
                        key={eventIndex}
                        whileHover={{ scale: 1.05 }}
                        className={`
                          px-1 py-0.5 rounded text-xs text-white cursor-pointer truncate
                          ${event.color}
                        `}
                        onClick={(e) => handleEventClick(event, e)}
                        title={event.title}
                      >
                        {event.title}
                      </motion.div>
                    ))}
                    
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {!isPortal && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Appointments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Milestones</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedDate(new Date());
                  setSelectedEvent(null);
                  setEventForm(prev => ({
                    ...prev,
                    date: format(new Date(), 'yyyy-MM-dd')
                  }));
                  setShowEventModal(true);
                }}
              >
                <ApperIcon name="Plus" size={16} className="mr-1" />
                New Event
              </Button>
            </div>
          </div>
        )}
      </Card>

<EventModal 
        showEventModal={showEventModal}
        setShowEventModal={setShowEventModal}
        selectedEvent={selectedEvent}
        eventForm={eventForm}
        setEventForm={setEventForm}
        handleSaveEvent={handleSaveEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
    </>
  );
};

export default CalendarWidget;