import React, { useState, useRef, useEffect } from 'react';

const CustomDatePicker = ({ value, onChange, onClear, placeholderText = "Select a date" }) => {
  // console.log("DatePicker rendered for:", placeholder, "with value:", value);
  // console.log("Placeholder received:", placeholder);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const calendarRef = useRef(null);
  
  // Get today's date for date restriction
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Set the deadline date (March 20, 2025 in this example)
  const deadline = new Date(2025, 2, 20); // Month is 0-indexed (2 = March)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  useEffect(() => {
    // Event listener to close the calendar when clicking outside
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update internal state when external value changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    } else {
      // Clear the date when value is empty
      setSelectedDate(null);
    }
  }, [value]);

  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    // Get day of week (0-6, Sunday to Saturday)
    let day = new Date(year, month, 1).getDay();
    // Convert to Monday as first day (1-7)
    return day === 0 ? 7 : day;
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    
    // Prevent selecting dates before today
    if (newDate < today) {
      return;
    }
    
    setSelectedDate(newDate);
    
    // Format date as YYYY-MM-DD for the input value
    const formattedDate = newDate.toISOString().split('T')[0];
    onChange({ target: { value: formattedDate } });
    
    setShowCalendar(false);
  };

  // Handle clearing the date
  const handleClear = (e) => {
    e.stopPropagation(); // Prevent opening calendar when clearing
    setSelectedDate(null);
    if (onClear) {
      onClear();
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const days = [];
    
    // Add previous month's days
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1 < 0 ? 11 : currentMonth - 1, 
                                          currentMonth - 1 < 0 ? currentYear - 1 : currentYear);
    for (let i = firstDay - 1; i > 0; i--) {
      days.push(
        <div key={`prev-${daysInPrevMonth - i + 1}`} className="text-center p-2 text-gray-300">
          {daysInPrevMonth - i + 1}
        </div>
      );
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = selectedDate && 
                        date.getDate() === selectedDate.getDate() && 
                        date.getMonth() === selectedDate.getMonth() && 
                        date.getFullYear() === selectedDate.getFullYear();
      
      const isPastDate = date < today;
      const isInHighlightRange = date >= today && date < deadline;
      
      // Determine styling
      let bgColorClass = '';
      let textColorClass = isPastDate ? 'text-gray-300' : 'text-gray-800';
      let cursorClass = isPastDate ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-purple-200';
      
      if (isSelected) {
        bgColorClass = 'bg-[#7B1984]';
        textColorClass = 'text-white';
      } else if (isInHighlightRange) {
       // Style for highlighted range if needed
      }
      
      days.push(
        <div 
          key={day} 
          className={`text-center p-2 ${cursorClass} ${bgColorClass} ${textColorClass} rounded-full`}
          onClick={() => !isPastDate && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    
    // Add next month's days to fill remaining cells
    const totalCells = Math.ceil((daysInMonth + firstDay - 1) / 7) * 7;
    for (let i = daysInMonth + firstDay - 1; i < totalCells; i++) {
      days.push(
        <div key={`next-${i - daysInMonth - firstDay + 2}`} className="text-center p-2 text-gray-300">
          {i - daysInMonth - firstDay + 2}
        </div>
      );
    }
    
    return days;
  };

  const formatDisplayDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="relative" ref={calendarRef}>
      <div className="flex items-center">
        <div 
          className="border w-full h-10 px-3 flex items-center rounded-full cursor-pointer bg-white"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {formatDisplayDate() ||  placeholderText}
        </div>
        
        {/* Clear button - only show when a date is selected */}
        {selectedDate && (
          <button 
            type="button"
            onClick={handleClear}
            className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Clear date"
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> */}
              {/* <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /> */}
            {/* </svg> */}
          </button>
        )}
      </div>
      
      {showCalendar && (
        <div className="absolute mt-1 border rounded-xl shadow-lg bg-white z-10 w-64 overflow-hidden">
          <div className="p-3 flex justify-between items-center border-b">
            <div className="flex items-center">
              <button 
                onClick={handlePrevMonth}
                className="mr-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ‹
              </button>
              <div className="relative">
                <select 
                  value={currentMonth} 
                  onChange={handleMonthChange}
                  className="appearance-none bg-transparent pl-1 pr-6 outline-none text-gray-800"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  ▼
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <select 
                  value={currentYear} 
                  onChange={handleYearChange}
                  className="appearance-none bg-transparent pl-1 pr-6 outline-none text-gray-800"
                >
                  {Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  ▼
                </div>
              </div>
              <button 
                onClick={handleNextMonth}
                className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ›
              </button>
            </div>
          </div>
          
          <div className="p-2">
            <div className="grid grid-cols-7">
              {days.map(day => (
                <div key={day} className="text-center p-2 font-medium text-gray-600 text-sm">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
        </div>
      )}
      
      {/* Hidden input to maintain form compatibility */}
      <input 
        type="hidden" 
        id="date" 
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''} 
      />
    </div>
  );
};

export default CustomDatePicker;