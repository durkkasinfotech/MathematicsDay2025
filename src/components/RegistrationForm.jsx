import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    contactNumber: '',
    emailId: '',
    collegeName: '',
    department: '',
    yearSemester: '',
    areaOfInterest: '',
    courseInterest: '',
    competitionCourse: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const departments = ['B.Com', 'BSc', 'BCA', 'BA', 'MBA', 'Other'];
  const yearSemesters = [
    '1st Year / 1st Semester',
    '1st Year / 2nd Semester',
    '2nd Year / 3rd Semester',
    '2nd Year / 4th Semester',
    '3rd Year / 5th Semester',
    '3rd Year / 6th Semester',
    '4th Year / 7th Semester',
    '4th Year / 8th Semester',
    'Other'
  ];
  const areasOfInterest = ['Edukoot', 'AI & Robotics', 'Accounting & Taxation', 'Digital Marketing'];
  const courseInterests = ['Yes', 'No', 'Maybe (Need more information)'];
  const competitionCourses = [
    'Math + AI = Innovation',
    'Applied Maths + AI Case Challenges',
    'AI in Finance - Simulation Challenge'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Validation
    if (!formData.fullName || !formData.contactNumber || !formData.emailId || 
        !formData.collegeName || !formData.department || !formData.yearSemester || 
        !formData.areaOfInterest || !formData.courseInterest || !formData.competitionCourse) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailId)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setIsSubmitting(false);
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\D/g, ''))) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid 10-digit contact number.' });
      setIsSubmitting(false);
      return;
    }

    try {
      if (supabase) {
        // Check if email already exists (duplicate check)
        const emailToCheck = formData.emailId.trim().toLowerCase();
        const { data: existingData, error: checkError } = await supabase
          .from('math_lead_registrations')
          .select('email_id')
          .eq('email_id', emailToCheck)
          .limit(1);

        if (checkError) {
          console.error('❌ Error checking email:', checkError);
          // Continue with submission if check fails (database will catch duplicate)
        }

        if (existingData && existingData.length > 0) {
          setSubmitStatus({ 
            type: 'error', 
            message: 'This email is already registered. Please use a different email address or contact us if you need assistance.' 
          });
          setIsSubmitting(false);
          return;
        }

        // Prepare data for insertion
        const registrationData = {
          full_name: formData.fullName.trim(),
          date_of_birth: formData.dateOfBirth || null,
          contact_number: formData.contactNumber.trim(),
          email_id: emailToCheck,
          college_name: formData.collegeName.trim(),
          department: formData.department,
          year_semester: formData.yearSemester.trim(),
          area_of_interest: formData.areaOfInterest,
          competition_course: formData.competitionCourse,
          course_interest: formData.courseInterest,
          registration_date: new Date().toISOString(),
        };

        console.log('📤 Submitting registration to Supabase...', registrationData);

        // Insert data into Supabase table
        const { data, error } = await supabase
          .from('math_lead_registrations')
          .insert([registrationData])
          .select();

        if (error) {
          console.error('❌ Supabase Error:', error);
          
          // Check for duplicate email error (PostgreSQL error code 23505)
          if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
            setSubmitStatus({ 
              type: 'error', 
              message: 'This email is already registered. Please use a different email address or contact us if you need assistance.' 
            });
            setIsSubmitting(false);
            return;
          }
          
          throw error;
        }

        if (data && data.length > 0) {
          console.log('✅ Registration stored successfully in database:', data[0]);
          setSubmitStatus({ 
            type: 'success', 
            message: 'Registration submitted successfully! Your data has been saved. We will contact you soon.' 
          });
          
          // Reset form
          setFormData({
            fullName: '',
            dateOfBirth: '',
            contactNumber: '',
            emailId: '',
            collegeName: '',
            department: '',
            yearSemester: '',
            areaOfInterest: '',
            courseInterest: '',
            competitionCourse: '',
          });
        } else {
          throw new Error('No data returned from database');
        }
      } else {
        // Supabase not configured - show warning
        console.warn('⚠️ Supabase is not configured. Data will not be saved.');
        console.log('Form Data (not saved):', formData);
        setSubmitStatus({ 
          type: 'error', 
          message: 'Supabase is not configured. Please set up your .env file with Supabase credentials to save registrations.' 
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Better error messages based on error type
      let errorMessage = 'An error occurred while submitting. Please try again later.';
      
      if (error?.code === '23505') {
        errorMessage = 'This email is already registered. Please use a different email address.';
      } else if (error?.code === 'PGRST116' || error?.code === '42501') {
        errorMessage = 'Row Level Security policy error. Please contact administrator or check RLS policies in Supabase.';
      } else if (error?.status === 401 || error?.code === 'PGRST301') {
        errorMessage = 'Authentication error. Please check your Supabase API key in .env file.';
      } else if (error?.message?.includes('row-level security')) {
        errorMessage = 'RLS Policy Error: Please run FIX_RLS_POLICY_COMPLETE.sql in Supabase SQL Editor to fix this.';
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      // Log detailed error for debugging
      console.error('Full error details:', {
        message: error?.message,
        code: error?.code,
        status: error?.status,
        details: error?.details,
        hint: error?.hint
      });
      
      setSubmitStatus({ 
        type: 'error', 
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDate = new Date();
  const registrationStart = new Date('2025-12-10');
  const registrationEnd = new Date('2025-12-18');
  // Enable for testing - set to true to allow form submission anytime
  const isRegistrationOpen = true; // Testing mode enabled
  // const isRegistrationOpen = currentDate >= registrationStart && currentDate <= registrationEnd; // Production mode

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-0"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 z-0"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 z-0"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 animate-fade-in-up">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Annual Event</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 tracking-tight px-2 leading-tight animate-fade-in-up-delay-1">
              Mathematics Day 2025
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-blue-100 px-2 animate-fade-in-up-delay-2">
              December 22, 2025
            </p>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto px-2 leading-relaxed animate-fade-in-up-delay-3">
              Where Mathematics Meets Artificial Intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-12">
        {/* Important Dates Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="card-premium card-hover p-5 sm:p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fa fa-calendar-check text-white text-lg sm:text-xl"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Registration Period</h3>
                <p className="text-xs sm:text-sm text-gray-600">Dec 10 - 18, 2025</p>
              </div>
            </div>
          </div>

          <div className="card-premium card-hover p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fa fa-upload text-white text-lg sm:text-xl"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Online Submission</h3>
                <p className="text-xs sm:text-sm text-gray-600">Dec 10 - 19, 2025</p>
              </div>
            </div>
          </div>

          <div className="card-premium card-hover p-5 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fa fa-trophy text-white text-lg sm:text-xl"></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Result Announcement</h3>
                <p className="text-xs sm:text-sm text-gray-600">Dec 22, 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Closed Warning - Hidden in testing mode */}
        {false && !isRegistrationOpen && (
          <div className="card-premium p-5 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fa fa-exclamation-triangle text-white text-lg sm:text-xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-red-900 text-base sm:text-lg mb-1.5">Registration Currently Closed</h3>
                <p className="text-sm sm:text-base text-red-700 leading-relaxed">
                  Registration is currently closed. Please check back during the registration period (December 10-18, 2025).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="card-premium mb-8 sm:mb-12 overflow-hidden">
          {/* Form Header with Gradient */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 text-white px-5 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8">
            <div className="text-center">
              <div className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 mb-4 sm:mb-5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                <span className="text-white font-semibold text-xs sm:text-sm uppercase tracking-wider">Student Registration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 px-2 tracking-tight">
                Registration Form
              </h2>
              <div className="w-24 sm:w-32 h-1 bg-white/30 mx-auto rounded-full mb-4"></div>
              <p className="text-sm sm:text-base text-blue-100 mt-4 px-2 leading-relaxed max-w-2xl mx-auto">
                Please fill in all required information to complete your registration
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 sm:p-6 md:p-8 lg:p-10">
          
            {submitStatus.message && (
              <div
                className={`mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl border-l-4 shadow-md ${
                  submitStatus.type === 'success'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 text-green-800'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500 text-red-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <i className={`fa ${submitStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl sm:text-2xl flex-shrink-0 mt-0.5`}></i>
                  <p className="font-semibold text-sm sm:text-base leading-relaxed">{submitStatus.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                    <i className="fa fa-user-circle text-primary-600 text-sm"></i>
                    <span className="text-sm font-bold text-primary-700 uppercase tracking-wide">Personal Information</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
              <label htmlFor="fullName" className="label-field text-sm sm:text-base">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <i className="fa fa-user absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 pointer-events-none z-10 text-sm sm:text-base transition-colors"></i>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
                  required
                  placeholder="Enter your full name"
                />
              </div>
              </div>

              {/* Date of Birth */}
              <div>
              <label htmlFor="dateOfBirth" className="label-field text-sm sm:text-base">
                Date of Birth <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative group">
                <i className="fa fa-calendar absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 pointer-events-none z-10 text-sm sm:text-base transition-colors"></i>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="input-field pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
                />
              </div>
              </div>

              {/* Contact Number */}
              <div>
              <label htmlFor="contactNumber" className="label-field text-sm sm:text-base">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <i className="fa fa-phone absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 pointer-events-none z-10 text-sm sm:text-base transition-colors"></i>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="input-field pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
                  required
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  inputMode="numeric"
                />
              </div>
              </div>

              {/* Email ID */}
              <div className="md:col-span-2">
              <label htmlFor="emailId" className="label-field text-sm sm:text-base">
                Email ID <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <i className="fa fa-envelope absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 pointer-events-none z-10 text-sm sm:text-base transition-colors"></i>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="input-field pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
                  required
                  placeholder="your.email@example.com"
                  inputMode="email"
                />
              </div>
              </div>

                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                    <i className="fa fa-graduation-cap text-indigo-600 text-sm"></i>
                    <span className="text-sm font-bold text-indigo-700 uppercase tracking-wide">Academic Information</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* College Name */}
              <div className="md:col-span-2">
              <label htmlFor="collegeName" className="label-field text-sm sm:text-base">
                College Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <i className="fa fa-university absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 pointer-events-none z-10 text-sm sm:text-base transition-colors"></i>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  className="input-field pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
                  required
                  placeholder="Enter your college name"
                />
              </div>
              </div>

              {/* Department / Course */}
              <div>
                <label htmlFor="department" className="label-field text-sm sm:text-base">
                  Department / Course <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <i className="fa fa-graduation-cap absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 z-10 pointer-events-none text-sm sm:text-base transition-colors"></i>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-field pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Department / Course</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <i className="fa fa-chevron-down absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm"></i>
                </div>
              </div>

              {/* Year / Semester */}
              <div>
              <label htmlFor="yearSemester" className="label-field text-sm sm:text-base">
                Year / Semester <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <i className="fa fa-calendar-alt absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 z-10 pointer-events-none text-sm sm:text-base transition-colors"></i>
                <select
                  id="yearSemester"
                  name="yearSemester"
                  value={formData.yearSemester}
                  onChange={handleChange}
                  className="input-field pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Year / Semester</option>
                  {yearSemesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                <i className="fa fa-chevron-down absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm"></i>
              </div>
              </div>

                </div>
              </div>

              {/* Interest & Preferences Section */}
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                    <i className="fa fa-heart text-purple-600 text-sm"></i>
                    <span className="text-sm font-bold text-purple-700 uppercase tracking-wide">Interest & Preferences</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Area of Interest */}
              <div className="md:col-span-2">
                <label htmlFor="areaOfInterest" className="label-field text-sm sm:text-base">
                  Which area are you interested in? <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <i className="fa fa-star absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 z-10 pointer-events-none text-sm sm:text-base transition-colors"></i>
                  <select
                    id="areaOfInterest"
                    name="areaOfInterest"
                    value={formData.areaOfInterest}
                    onChange={handleChange}
                    className="input-field pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select an area of interest</option>
                    {areasOfInterest.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <i className="fa fa-chevron-down absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm"></i>
                </div>
              </div>

              {/* Competition Category */}
              <div className="md:col-span-2">
                <label htmlFor="competitionCourse" className="label-field text-sm sm:text-base">
                  Select Competition Category <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <i className="fa fa-trophy absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 z-10 pointer-events-none text-sm sm:text-base transition-colors"></i>
                  <select
                    id="competitionCourse"
                    name="competitionCourse"
                    value={formData.competitionCourse}
                    onChange={handleChange}
                    className="input-field pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select a competition category</option>
                    {competitionCourses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  <i className="fa fa-chevron-down absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm"></i>
                </div>
              </div>

              {/* Course Interest */}
              <div className="md:col-span-2">
                <label htmlFor="courseInterest" className="label-field text-sm sm:text-base">
                  Interested in institution's courses? <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <i className="fa fa-question-circle absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 z-10 pointer-events-none text-sm sm:text-base transition-colors"></i>
                  <select
                    id="courseInterest"
                    name="courseInterest"
                    value={formData.courseInterest}
                    onChange={handleChange}
                    className="input-field pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select an option</option>
                    {courseInterests.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                  <i className="fa fa-chevron-down absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10 text-sm"></i>
                </div>
              </div>
                </div>
              </div>

            {/* Submit Button */}
            <div className="pt-6 sm:pt-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="text-xs text-gray-500 font-medium">Ready to submit?</div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !isRegistrationOpen}
                className={`w-full btn-primary text-sm sm:text-base py-4 sm:py-4 relative overflow-hidden group ${
                  isSubmitting || !isRegistrationOpen
                    ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100'
                    : ''
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                    <i className="fa fa-spinner fa-spin text-lg sm:text-xl"></i>
                    <span>Submitting Registration...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                    <i className="fa fa-paper-plane text-sm sm:text-base"></i>
                    <span className="font-semibold">Submit Registration</span>
                  </span>
                )}
              </button>
            </div>
          </form>
          </div>
        </div>

        {/* Competition Categories */}
        <div className="card-premium p-5 sm:p-6 md:p-8 mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">Competition Categories</h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full"></div>
            <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto px-2 leading-relaxed">
              Explore innovative projects that combine Mathematics and Artificial Intelligence to solve real-world challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {/* Category 1 */}
            <div className="card-hover p-5 sm:p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl overflow-hidden">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
                <i className="fa fa-lightbulb text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Math + AI = Innovation</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-center sm:text-left">
                Create small projects showing how Math + AI can solve real-life problems.
              </p>
              <div className="mb-3 sm:mb-4">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  Example Categories: Education, Construction, Scheduling, Weather
                </span>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-primary-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Predict exam marks using simple AI</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-primary-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Estimate material needed for construction</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-primary-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Create an AI timetable maker</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-primary-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Predict weather using maths + AI</span>
                </div>
              </div>
            </div>

            {/* Category 2 */}
            <div className="card-hover p-5 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl overflow-hidden">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
                <i className="fa fa-briefcase text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">Applied Maths + AI Case Challenges</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-center sm:text-left">
                Solve real-life industry problems using Math + AI.
              </p>
              <div className="mb-3 sm:mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Example Categories: Logistics, Investment, Energy, Disaster Management
                </span>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-green-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Reduce transport cost using maths + prediction models</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-green-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Choose the best investment mix using maths + AI tools</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-green-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Predict energy usage using simple AI</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-green-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Estimate flood risk using probability + ML</span>
                </div>
              </div>
            </div>

            {/* Category 3 */}
            <div className="card-hover p-5 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl overflow-hidden">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
                <i className="fa fa-chart-line text-white text-xl sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">AI in Finance - Simulation Challenge</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed text-center sm:text-left">
                Explore how Math + AI are used in finance.
              </p>
              <div className="mb-3 sm:mb-4">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  Example Categories: Options Trading, Price Prediction, Risk Analysis
                </span>
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-purple-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Calculate option prices using formulas + simple AI</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-purple-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Predict future prices using time-series models</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-xs text-gray-600">
                  <i className="fa fa-check-circle text-purple-500 mt-0.5 sm:mt-1 flex-shrink-0"></i>
                  <span className="leading-relaxed">Check portfolio risk using simulations + AI scoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <div className="card-premium p-5 sm:p-6 inline-block max-w-full">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              <i className="fa fa-info-circle text-primary-500 mr-2"></i>
              For any queries or assistance
            </p>
            <a 
              href="https://darecentre.in/contact.html" 
              className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors text-sm sm:text-base inline-flex items-center gap-1"
            >
              Contact Dare Centre <i className="fa fa-external-link-alt text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
