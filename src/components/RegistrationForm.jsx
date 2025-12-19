import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  // Enable for testing - set to true to allow form submission anytime
  const isRegistrationOpen = true; // Testing mode enabled
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
                  Where Mathematics Meets Artificial Intelligence
                </span>
              </h1>
            </div>
            <p className="max-w-xl text-base md:text-lg text-blue-50 leading-relaxed drop-shadow-sm">
              December 22, 2025
              <br />
              Join us for a day of innovation, challenges, and exploring the future of Math and AI.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 max-w-xl">
              {/* Registration Period */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Registration</p>
                <p className="text-base font-bold text-slate-900">Dec 17 – 20</p>
                <p className="text-xs text-slate-600">Period to register</p>
              </div>

              {/* Online Submission */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Submission</p>
                <p className="text-base font-bold text-slate-900">Dec 17 – 21</p>
                <p className="text-xs text-slate-600">Online project submission</p>
              </div>

              {/* Result Announcement */}
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Results</p>
                <p className="text-base font-bold text-slate-900">Dec 22, 2025</p>
                <p className="text-xs text-slate-600">Winners announced</p>
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
                      College Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      placeholder="Enter college name"
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights (Competition Categories) */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <header className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Competition Categories
            </span>
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore innovative projects that combine Mathematics and Artificial Intelligence to solve real-world challenges
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl ring-1 ring-blue-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 mb-4">
                <i className="fa fa-lightbulb text-blue-600 mr-2"></i>
                <span className="text-sm font-bold text-blue-700">Innovation</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Math + AI = Innovation</h3>
              <p className="text-sm text-slate-600 mb-4">
                Create small projects showing how Math + AI can solve real-life problems.
              </p>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Predict exam marks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Construction material estimation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>AI Timetable maker</span>
                </li>
              </ul>
            </div>
          </article>

          {/* Card 2 */}
          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-emerald-50 p-8 shadow-xl ring-1 ring-emerald-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 mb-4">
                <i className="fa fa-briefcase text-emerald-600 mr-2"></i>
                <span className="text-sm font-bold text-emerald-700">Case Challenges</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Applied Maths + AI</h3>
              <p className="text-sm text-slate-600 mb-4">
                Solve real-life industry problems using Math + AI.
              </p>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span>Reduce transport costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span>Investment mix Optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span>Predict energy usage</span>
                </li>
              </ul>
            </div>
          </article>

          {/* Card 3 */}
          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-purple-50 p-8 shadow-xl ring-1 ring-purple-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 mb-4">
                <i className="fa fa-chart-line text-purple-600 mr-2"></i>
                <span className="text-sm font-bold text-purple-700">Finance</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">AI in Finance</h3>
              <p className="text-sm text-slate-600 mb-4">
                Explore how Math + AI are used in finance simulations.
              </p>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>Option price calculation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>Future price prediction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>Portfolio risk analysis</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* Project Upload CTA Section */}
      <section className="mx-auto max-w-4xl px-4 pb-16 lg:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-10 shadow-2xl sm:px-12 sm:py-16 text-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#ffffff33,_transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl mb-4">
              Ready with your Project?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-8">
              If you have prepared your PPT or PDF presentation for the competition, please upload it here before the deadline.
            </p>
            <Link
              to="/math/upload"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-bold text-blue-900 transition-all hover:bg-blue-50 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900"
            >
              Upload Project File
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </Link>
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
