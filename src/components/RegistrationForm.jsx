import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const RegistrationForm = () => {
  useEffect(() => {
    document.title = 'Mathematics Day 2025 - Event Registration | Dare Centre';
  }, []);
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

  const departments = ['B.Com', 'BSc', 'BCA', 'BA', 'MBA', 'B.E', 'Other'];
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
  const areasOfInterest = ['Edukoot', 'AI & Robotics', 'Accounting & Taxation', 'Digital Marketing', 'Business Administration'];
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
    if (!formData.fullName || !formData.dateOfBirth || !formData.contactNumber || !formData.emailId ||
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
  const registrationStart = new Date('2025-12-17');
  const registrationEnd = new Date('2025-12-20');
  // Registration is now closed as the event is over
  const isRegistrationOpen = false;
  // const isRegistrationOpen = currentDate >= registrationStart && currentDate <= registrationEnd; // Production mode

  return (
    <div className="relative bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#1e40af33,_transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,_transparent_30%,_#3b82f611_50%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-5" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:py-20">
          {/* Left Side: Event Details */}
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200 drop-shadow-sm">
                Annual Event
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Mathematics Day 2025
                </span>
                <span className="block text-2xl md:text-3xl font-bold text-blue-100 mt-3 tracking-wide">
                  Event Successfully Completed!
                </span>
              </h1>
            </div>
            <p className="max-w-xl text-base md:text-lg text-white leading-relaxed drop-shadow-sm">
              December 22, 2025
              <br />
              Thank you to everyone who participated in this celebration of innovation and mathematics.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 max-w-xl">
              {/* Registration Period */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1 flex items-center">
                  Registration
                  <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-400"></span>
                </p>
                <p className="text-base font-bold text-white">Closed</p>
                <p className="text-xs text-blue-100">Dec 17 – 20</p>
              </div>

              {/* Online Submission */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1 flex items-center">
                  Submission
                  <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-400"></span>
                </p>
                <p className="text-base font-bold text-white">Ended</p>
                <p className="text-xs text-blue-100">Dec 17 – 21</p>
              </div>

              {/* Result Announcement */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center">
                  Status
                  <span className="ml-2 inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                </p>
                <p className="text-base font-bold text-white">Completed</p>
                <p className="text-xs text-blue-100">Dec 22, 2025</p>
              </div>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="flex-1">
            <div className="mx-auto max-w-md rounded-2xl bg-white/10 p-1 backdrop-blur">
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="mb-1 text-lg font-semibold text-slate-900">Student Registration</h2>
                <p className="mb-4 text-xs text-slate-600">
                  Please fill in your details to register for the event.
                </p>

                {submitStatus.message && (
                  <p
                    className={`mb-4 text-xs rounded-md px-3 py-2 border ${submitStatus.type === 'success'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-red-700 bg-red-50 border-red-200'
                      }`}
                  >
                    {submitStatus.message}
                  </p>
                )}

                {!isRegistrationOpen ? (
                  <div className="space-y-6 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                      <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m1-11a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">Registration Closed</h3>
                      <p className="text-sm text-slate-600">
                        We are no longer accepting new registrations for Mathematics Day 2025 as the event has concluded.
                      </p>
                    </div>
                    <div className="pt-4">
                      <a
                        href="https://darecentre.in/"
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Visit Homepage
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Full Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        required
                      />
                    </div>

                    {/* DOB & Contact */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Date of Birth<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Contact Number<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          placeholder="10-digit number"
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          maxLength="10"
                          inputMode="numeric"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        inputMode="email"
                        required
                      />
                    </div>

                    {/* College Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        School / College Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        placeholder="Enter school or college name"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        required
                      />
                    </div>

                    {/* Department & Year */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="relative">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Department<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none bg-white cursor-pointer"
                          required
                        >
                          <option value="">Select Dept</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Year / Sem<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="yearSemester"
                          value={formData.yearSemester}
                          onChange={handleChange}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none bg-white cursor-pointer"
                          required
                        >
                          <option value="">Select Year</option>
                          {yearSemesters.map((sem) => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Competition Course */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Competition Category<span className="text-red-500">*</span>
                      </label>
                      <select
                        name="competitionCourse"
                        value={formData.competitionCourse}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none bg-white cursor-pointer"
                        required
                      >
                        <option value="">Select Competition Category</option>
                        {competitionCourses.map((course) => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-6 text-slate-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Areas of Interest & Course Interest */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="relative">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Area of Interest<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="areaOfInterest"
                          value={formData.areaOfInterest}
                          onChange={handleChange}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none bg-white cursor-pointer"
                          required
                        >
                          <option value="">Select Area</option>
                          {areasOfInterest.map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Interested in Courses?<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="courseInterest"
                          value={formData.courseInterest}
                          onChange={handleChange}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 appearance-none bg-white cursor-pointer"
                          required
                        >
                          <option value="">Select Option</option>
                          {courseInterests.map((val) => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-slate-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !isRegistrationOpen}
                      className="flex w-full items-center justify-center rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70 mt-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Register Now'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Winners Circle / Hall of Fame Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:py-32 relative overflow-hidden bg-white/40">

        <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto items-stretch">

          {/* ================= FIRST PLACE ================= */}
          <div className="relative group h-full">
            <div className="relative bg-white rounded-[2.8rem] border border-amber-100 shadow-2xl overflow-hidden
                      flex flex-col h-full transition-all duration-500
                      group-hover:-translate-y-2 group-hover:shadow-amber-200/50">

              {/* CONTENT */}
              <div className="p-8 md:p-12 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-10">

                  {/* LEFT TEXT */}
                  <div>
                    <span className="inline-block px-4 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-black">
                      🏆 FIRST PLACE
                    </span>
                    <h3 className="text-5xl font-black mt-4">P. Vimal</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                      Sree Sowdambika Engineering
                    </p>
                  </div>

                  {/* SIMPLE WINNER BADGE */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300
                              flex items-center justify-center shadow-lg
                              transition-all duration-500
                              group-hover:-translate-y-2 group-hover:rotate-6">
                      <span className="text-white text-3xl">🏆</span>
                    </div>

                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white
                              flex items-center justify-center text-[10px] font-black
                              shadow border border-amber-200">
                      #01
                    </div>
                  </div>
                </div>

                {/* SCORE */}
                <div className="bg-slate-50 p-6 rounded-2xl mt-auto">
                  <p className="text-xs font-black text-blue-600 uppercase mb-4">
                    Expert Evaluation Score
                  </p>
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2">
                      {[2, 2, 2, 2, 1.5].map((s, i) => (
                        <div key={i} className="text-center">
                          <div className="w-10 py-2 rounded-xl bg-white border font-bold text-blue-600">
                            {s}
                          </div>
                          <p className="text-[10px] font-bold">C{i + 1}</p>
                        </div>
                      ))}
                    </div>
                    <div className="text-4xl font-black">
                      9.5<span className="text-lg text-blue-600">/10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGE */}
              <div className="px-8 pb-10">
                <img
                  src="/assets/img/vimal.jpg"
                  alt="P Vimal Project"
                  className="w-full h-56 object-cover rounded-2xl shadow-lg border border-amber-200
                       transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>

          {/* ================= RUNNER UP ================= */}
          <div className="relative group h-full">
            <div className="relative bg-white rounded-[2.8rem] border border-slate-200 shadow-xl overflow-hidden
                      flex flex-col h-full transition-all duration-500
                      group-hover:-translate-y-2 group-hover:shadow-slate-200/60">

              {/* CONTENT */}
              <div className="p-8 md:p-12 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-10">

                  {/* LEFT TEXT */}
                  <div>
                    <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-black">
                      🥈 RUNNER UP
                    </span>
                    <h3 className="text-5xl font-black mt-4">Prasedha V</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                      Sri Ramanas Arts & Science
                    </p>
                  </div>

                  {/* SIMPLE RUNNER BADGE */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100
                              flex items-center justify-center shadow-md
                              transition-all duration-500
                              group-hover:-translate-y-2 group-hover:-rotate-6">
                      <span className="text-slate-500 text-3xl">🥈</span>
                    </div>

                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white
                              flex items-center justify-center text-[10px] font-black
                              shadow border border-slate-200">
                      #02
                    </div>
                  </div>
                </div>

                {/* SCORE */}
                <div className="bg-slate-50 p-6 rounded-2xl flex justify-around text-center mt-auto">
                  <div>
                    <p className="text-4xl font-black text-blue-600">8.5</p>
                    <p className="text-xs font-bold uppercase">Score</p>
                  </div>
                  <div>
                    <p className="text-lg font-black">100%</p>
                    <p className="text-xs font-bold uppercase">Authenticity</p>
                  </div>
                  <div>
                    <p className="text-lg font-black">A+</p>
                    <p className="text-xs font-bold uppercase">Grade</p>
                  </div>
                </div>
              </div>

              {/* IMAGE */}
              <div className="px-8 pb-10">
                <img
                  src="/assets/img/prasedha.jpg"
                  alt="Prasedha Project"
                  className="w-full h-56 object-cover rounded-2xl shadow-md border border-slate-200
                       transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Program Highlights (Competition Categories) */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-20 border-t border-slate-100">
        <header className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-slate-200"></span>
            COMPETITION CATEGORIES
            <span className="h-px w-8 bg-slate-200"></span>
          </h2>
        </header>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { title: "Math + AI = Innovation", icon: "fa-lightbulb", color: "blue", desc: "Predict exam marks, construction material estimation, and AI Timetable makers." },
            { title: "Applied Maths + AI", icon: "fa-briefcase", color: "emerald", desc: "Transport cost reduction, investment mix optimization, and energy usage prediction." },
            { title: "AI in Finance", icon: "fa-chart-line", color: "purple", desc: "Option price calculation, future price prediction, and portfolio risk analysis." }
          ].map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className={`h-10 w-10 rounded-xl bg-${cat.color}-50 text-${cat.color}-600 flex items-center justify-center mb-4`}>
                <i className={`fa ${cat.icon}`}></i>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Project Upload CTA Section */}
      <section className="mx-auto max-w-4xl px-4 pb-16 lg:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-10 shadow-2xl sm:px-12 sm:py-16 text-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#ffffff33,_transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl mb-4">
              Project Submissions Closed
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300 mb-8">
              The deadline for project submissions has passed. Thank you for your innovative contributions!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://darecentre.in/"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-3 text-base font-bold text-white border border-white/20 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Back to Home
              </a>
              <a
                href="tel:+917812876787"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-bold text-white transition-all hover:bg-blue-700 hover:scale-105"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Call Button */}
      <a
        href="tel:+917812876787"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-all hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-bounce"
        aria-label="Call Now"
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>
    </div>
  );
};

export default RegistrationForm;