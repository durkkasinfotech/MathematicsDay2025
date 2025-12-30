import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const NxtZenWinter2025Page = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    grade: '',
    schoolName: '',
    parentName: '',
    contactNumber: '',
    email: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

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

    // Basic required-field check
    if (!formData.studentName || !formData.grade || !formData.parentName || !formData.contactNumber) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields (marked with *).' });
      setIsSubmitting(false);
      return;
    }

    // Simple mobile validation: at least 10 digits
    const digitsOnly = formData.contactNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid contact number (at least 10 digits).' });
      setIsSubmitting(false);
      return;
    }

    // Simple email validation if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (!supabase) {
        console.warn('Supabase client is not configured.');
        setSubmitStatus({
          type: 'error',
          message: 'Backend is not configured yet. Please contact the administrator.',
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from('nxtzenwinter2025_registrations').insert([
        {
          student_name: formData.studentName.trim(),
          grade: formData.grade,
          school_name: formData.schoolName || null,
          parent_name: formData.parentName.trim(),
          contact_number: formData.contactNumber.trim(),
          email: formData.email ? formData.email.trim() : null,
          city: formData.city || null,
        },
      ]);

      if (error) {
        console.error('Error inserting NxtZen Winter registration:', error);
        setSubmitStatus({
          type: 'error',
          message: 'Unable to save registration right now. Please try again later.',
        });
        setIsSubmitting(false);
        return;
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your registration has been saved successfully.',
      });

      // Reset form
      setFormData({
        studentName: '',
        grade: '',
        schoolName: '',
        parentName: '',
        contactNumber: '',
        email: '',
        city: '',
      });
    } catch (err) {
      console.error('Unexpected error while saving NxtZen Winter registration:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRegistrationOpen = false;

  return (
    <div className="relative bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#1e40af33,_transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,_transparent_30%,_#3b82f611_50%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-5" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:py-20">
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200 drop-shadow-sm">
                NxtZen Winter 2025
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  NxtZen Coders
                </span>
                <span className="block text-2xl md:text-3xl font-bold text-blue-100 mt-3 tracking-wide">
                  Event Registration Closed
                </span>
              </h1>
            </div>
            <p className="max-w-xl text-base md:text-lg text-blue-50 leading-relaxed drop-shadow-sm">
              Thank you for the overwhelming response! The NxtZen Winter 2025 coding adventure registrations are now closed.
              Stay tuned for our upcoming events and future batches.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 max-w-xl">
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Status</p>
                <p className="text-base font-bold text-red-600">Closed</p>
                <p className="text-xs text-slate-600">Admissions Full</p>
              </div>
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Eligibility</p>
                <p className="text-base font-bold text-slate-900">Grade KG - 12</p>
                <p className="text-xs text-slate-600">Upcoming Batches Soon</p>
              </div>
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Date</p>
                <p className="text-base font-bold text-slate-900">Dec 2025</p>
                <p className="text-xs text-slate-600">Winter Edition</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mx-auto max-w-md rounded-2xl bg-white/10 p-1 backdrop-blur">
              <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
                <div className="mb-6 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
                    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-3z" />
                    </svg>
                  </div>
                </div>
                <h2 className="mb-2 text-xl font-bold text-slate-900">Registrations Closed</h2>
                <p className="mb-6 text-sm text-slate-600 leading-relaxed">
                  We have reached our maximum capacity for this session. Follow us for updates on the next coding adventure!
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Need Help?</p>
                  <a
                    href="tel:+917812876787"
                    className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
                  >
                    <i className="fas fa-phone-alt text-xs"></i>
                    +91 78128 76787
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <header className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Program Highlights
            </span>
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Carefully designed tracks that introduce coding, robotics, animation, and 3D/VR in a playful and age-appropriate way
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl ring-1 ring-blue-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 mb-4">
                <span className="text-sm font-bold text-blue-700">KG - 2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">WizBot Jungle Adventure</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-base">Guide WizBot through exciting jungle missions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-base">Rescue animals and solve fun puzzles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-base">Learn basic logic and robotics concepts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-base">Find hidden treasures with simple coding activities</span>
                </li>
              </ul>
            </div>
          </article>

          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-purple-50 p-8 shadow-xl ring-1 ring-purple-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 mb-4">
                <span className="text-sm font-bold text-purple-700">Grades 3 – 5</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">Code &amp; Animate Your World</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span className="text-base">Create animations and mini-games</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span className="text-base">Build music bands and interactive stories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span className="text-base">Design their own Smart City</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span className="text-base">Learn coding through creative challenges</span>
                </li>
              </ul>
            </div>
          </article>

          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-emerald-50 p-8 shadow-xl ring-1 ring-emerald-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 mb-4">
                <span className="text-sm font-bold text-emerald-700">Grades 6 – 12</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">Build Future Cities in 3D &amp; VR</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span className="text-base">Design 3D buildings and city layouts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span className="text-base">Animate vehicles and environments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span className="text-base">Experience and explore their own Virtual Reality world</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span className="text-base">Learn future-ready tech skills</span>
                </li>
              </ul>
            </div>
          </article>
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

export default NxtZenWinter2025Page;
