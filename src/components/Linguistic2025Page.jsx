import { useState } from 'react';

const Linguistic2025Page = () => {
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
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    if (!formData.studentName || !formData.grade || !formData.parentName || !formData.contactNumber) {
      setSubmitStatus('Please fill in all required fields (marked with *).');
      setIsSubmitting(false);
      return;
    }

    console.log('Linguistic Tornado 2025 registration (temporary, frontend-only):', formData);
    setSubmitStatus('Thank you! Your details have been recorded. This is a temporary form – final confirmation will be taken later.');
    setIsSubmitting(false);

    setFormData({
      studentName: '',
      grade: '',
      schoolName: '',
      parentName: '',
      contactNumber: '',
      email: '',
      city: '',
    });
  };

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
                Explore • Discover • Invent • Create
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Linguistic Tornado – 2025
                </span>
                <span className="block text-2xl md:text-3xl font-bold text-blue-100 mt-3 tracking-wide">
                  A perfect blend of learning and fun in English!
                </span>
              </h1>
            </div>
            <p className="max-w-xl text-base md:text-lg text-blue-50 leading-relaxed drop-shadow-sm">
              Help your child build confidence in English through phonics, vocabulary, storytelling, and creative activities – all wrapped in exciting games and interactive sessions.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 max-w-xl">
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Dates</p>
                <p className="text-base font-bold text-slate-900">Dec 26 – 28</p>
                <p className="text-xs text-slate-600">10:00 AM – 1:00 PM</p>
              </div>
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Eligibility</p>
                <p className="text-base font-bold text-slate-900">Grades 1 – 5</p>
                <p className="text-xs text-slate-600">Limited seats. Register early.</p>
              </div>
              <div className="rounded-2xl bg-white backdrop-blur-md border border-white/30 px-5 py-4 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Venue</p>
                <p className="text-sm font-bold text-slate-900">ISOD</p>
                <p className="text-xs text-slate-600">58/2, MDR Nagar North, SBK College Road, Aruppukkottai</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mx-auto max-w-md rounded-2xl bg-white/10 p-1 backdrop-blur">
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="mb-1 text-lg font-semibold text-slate-900">Register Your Child</h2>
                <p className="mb-4 text-xs text-slate-600">
                  Temporary registration form – for initial interest collection only. Final confirmation process will be shared later.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Student Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Grade<span className="text-red-500">*</span>
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-base font-medium shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-slate-300"
                      >
                        <option value="" className="text-slate-500">Select grade</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3">Grade 3</option>
                        <option value="4">Grade 4</option>
                        <option value="5">Grade 5</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">School Name</label>
                      <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Parent / Guardian Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Parent Contact Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Email ID</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {submitStatus && (
                    <p className="text-xs text-sky-700 bg-sky-50 border border-sky-100 rounded-md px-3 py-2">
                      {submitStatus}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Interest'}
                  </button>
                </form>
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
              What Your Child Will Learn
            </span>
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Carefully crafted English sessions that build phonics, pronunciation, vocabulary, storytelling, and a love for language through play.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl ring-1 ring-blue-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 mb-4">
                <span className="text-sm font-bold text-blue-700">Phonics &amp; Pronunciation</span>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-base">Strengthen sound recognition and clear pronunciation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-base">Fun activities to connect letters, sounds, and words</span>
                </li>
              </ul>
            </div>
          </article>

          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-purple-50 p-8 shadow-xl ring-1 ring-purple-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 mb-4">
                <span className="text-sm font-bold text-purple-700">Vocabulary &amp; Word Games</span>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span className="text-base">Build strong vocabulary through engaging word games</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span className="text-base">Boost confidence in using new words in daily conversations</span>
                </li>
              </ul>
            </div>
          </article>

          <article className="group relative flex flex-col rounded-3xl bg-gradient-to-br from-white to-emerald-50 p-8 shadow-xl ring-1 ring-emerald-100/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 mb-4">
                <span className="text-sm font-bold text-emerald-700">Storytelling &amp; Creative Writing</span>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span className="text-base">Encourage imagination through stories and role play</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  <span className="text-base">Introduce creative writing with fun prompts and activities</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* Info & Contact Section */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <header className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              <span className="bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                Event Information
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about the Linguistic Tornado – 2025 program
            </p>
          </header>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Event Details Grid */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Event Details</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="group relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:ring-blue-200/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center mb-3">
                      <div className="rounded-lg bg-blue-100 p-2 mr-3">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Date &amp; Time</h4>
                    </div>
                    <p className="text-base text-slate-600 font-medium">December 26 – 28</p>
                    <p className="text-sm text-slate-500">10:00 AM – 1:00 PM</p>
                  </div>
                </div>

                <div className="group relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:ring-purple-200/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center mb-3">
                      <div className="rounded-lg bg-purple-100 p-2 mr-3">
                        <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Who Can Join?</h4>
                    </div>
                    <p className="text-base text-slate-600 font-medium">Children from Grades 1 to 5</p>
                    <p className="text-sm text-slate-500">A welcoming space for young learners</p>
                  </div>
                </div>

                <div className="group relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:ring-emerald-200/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center mb-3">
                      <div className="rounded-lg bg-emerald-100 p-2 mr-3">
                        <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Seats</h4>
                    </div>
                    <p className="text-base text-slate-600 font-medium">Limited seats only</p>
                    <p className="text-sm text-slate-500">Register early to secure a spot</p>
                  </div>
                </div>

                <div className="group relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-xl hover:ring-blue-200/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center mb-3">
                      <div className="rounded-lg bg-blue-100 p-2 mr-3">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414A4 4 0 1112.414 11.4l4.243 4.243a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414 0zM10 14a4 4 0 110-8 4 4 0 010 8z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Venue</h4>
                    </div>
                    <p className="text-base text-slate-600 font-medium">ISOD</p>
                    <p className="text-sm text-slate-500">
                      58/2, MDR Nagar North,
                      <br />SBK College Road,
                      <br />Aruppukkottai, Virudhunagar District,
                      <br />Tamil Nadu – 626101
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h3>
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-2xl text-white">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold mb-2">Need more information?</h4>
                    <p className="text-blue-100 leading-relaxed">
                      Call us for program details, schedules, and seat availability.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center mb-4">
                      <div className="rounded-lg bg-white/20 p-3 mr-4">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-200">Contact Number</p>
                        <p className="text-2xl font-bold">+91 78 12 87 67 87</p>
                      </div>
                    </div>

                    <div className="flex">
                      <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        Call Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Linguistic2025Page;
