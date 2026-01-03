import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const ViruthaiPongalPage = () => {
    const [registrationData, setRegistrationData] = useState({
        fullName: '',
        category: 'School', // 'School' or 'College'
        standard: '', // 1st Std to 12th Std
        degree: '', // BSc, MSc, Engg, etc.
        major: '',
        instituteName: '',
        emailId: '',
        contactNumber: '',
        agreedToTerms: false
    });

    const [submissionData, setSubmissionData] = useState({
        emailId: '',
        driveLink: '',
        instagramLink: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [subStatus, setSubStatus] = useState({ type: '', message: '' });
    const [subIsSubmitting, setSubIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [regId, setRegId] = useState('');

    const hashtags = ['#Edukoot', '#LearnWithEdukoot', '#EdukootInnovation', '#FutureSkills', '#DurkkasInnovations', '#TamilTechHeritage', '#AIInnovation2026', '#ViruthaiPongal2026'];

    const handleCopyHashtags = () => {
        navigator.clipboard.writeText(hashtags.join(' '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [submissionStep, setSubmissionStep] = useState(1);

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;

        if (name === 'contactNumber') {
            // Only allow digits and max length of 10
            const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
            setRegistrationData({ ...registrationData, [name]: sanitizedValue });
        } else if (name === 'agreedToTerms') {
            setRegistrationData({ ...registrationData, [name]: e.target.checked });
        } else {
            setRegistrationData({ ...registrationData, [name]: value });
        }
    };

    const handleSubmissionChange = (e) => {
        setSubmissionData({ ...submissionData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        // Final Validation
        if (registrationData.contactNumber.length !== 10) {
            setStatus({ type: 'error', message: 'Please enter a valid 10-digit mobile number.' });
            return;
        }

        if (!registrationData.agreedToTerms) {
            setStatus({ type: 'error', message: 'You must agree to the rules and regulations.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const { data: existing } = await supabase
                .from('viruthaipongal_registrations')
                .select('email_id')
                .eq('email_id', registrationData.emailId.trim())
                .single();

            if (existing) {
                setStatus({ type: 'error', message: 'Email already registered. Please proceed to submission.' });
                setIsSubmitting(false);
                return;
            }

            const { data, error } = await supabase
                .from('viruthaipongal_registrations')
                .insert([{
                    full_name: registrationData.fullName,
                    category: registrationData.category,
                    standard: registrationData.category === 'School' ? registrationData.standard : null,
                    degree: registrationData.category === 'College' ? registrationData.degree : null,
                    major: registrationData.category === 'College' ? registrationData.major : null,
                    institute_name: registrationData.instituteName,
                    email_id: registrationData.emailId,
                    contact_number: registrationData.contactNumber,
                    registration_date: new Date().toISOString(),
                }])
                .select('registration_no')
                .single();

            if (error) throw error;

            setRegId(data.registration_no);
            setShowSuccessModal(true);

            setRegistrationData({
                fullName: '',
                category: 'School',
                standard: '',
                degree: '',
                major: '',
                instituteName: '',
                emailId: '',
                contactNumber: '',
                agreedToTerms: false
            });

        } catch (error) {
            console.error('Registration Error:', error);
            setStatus({ type: 'error', message: 'Registration failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailValidation = async (e) => {
        e.preventDefault();
        setSubIsSubmitting(true);
        setSubStatus({ type: '', message: '' });

        try {
            const { data, error } = await supabase
                .from('viruthaipongal_registrations')
                .select('*')
                .eq('email_id', submissionData.emailId.trim())
                .single();

            if (error || !data) {
                setSubStatus({ type: 'error', message: 'Email not found. Please register first.' });
            } else {
                const { data: existingSub } = await supabase
                    .from('viruthaipongal_submissions')
                    .select('id')
                    .eq('email_id', submissionData.emailId.trim())
                    .single();

                if (existingSub) {
                    setSubStatus({ type: 'error', message: 'You have already submitted a video.' });
                } else {
                    setSubStatus({ type: 'success', message: 'Email verified. Please enter your links.' });
                    setSubmissionStep(2);
                }
            }
        } catch (error) {
            setSubStatus({ type: 'error', message: 'Error checking email.' });
        } finally {
            setSubIsSubmitting(false);
        }
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        setSubIsSubmitting(true);
        setSubStatus({ type: '', message: '' });

        if (!submissionData.driveLink.includes('drive.google.com')) {
            setSubStatus({ type: 'error', message: 'Please provide a valid Google Drive link.' });
            setSubIsSubmitting(false);
            return;
        }

        if (!submissionData.instagramLink.includes('instagram.com')) {
            setSubStatus({ type: 'error', message: 'Please provide a valid Instagram post link.' });
            setSubIsSubmitting(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('viruthaipongal_submissions')
                .insert([{
                    email_id: submissionData.emailId.trim(),
                    drive_link: submissionData.driveLink,
                    instagram_link: submissionData.instagramLink,
                    submitted_at: new Date().toISOString()
                }]);

            if (error) throw error;

            setSubStatus({ type: 'success', message: 'Video & Verification link submitted successfully! Good luck!' });
            setSubmissionStep(1);
            setSubmissionData({ emailId: '', driveLink: '', instagramLink: '' });

        } catch (error) {
            console.error('Submission Error:', error);
            setSubStatus({ type: 'error', message: 'Submission failed. Please try again.' });
        } finally {
            setSubIsSubmitting(false);
        }
    };

    return (
        <div className="relative bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-5 pb-12 md:pt-10 md:pb-16 bg-cyan-50">
                {/* Full Cover Background Image - Optimized for all screens */}
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-cyan-50" />
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] opacity-60"></div>
                </div>

                <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
                        {/* Left Side: Content */}
                        <div className="flex-1 space-y-4 text-center lg:text-left">
                            <div className="space-y-2 md:space-y-4">
                                <div className="inline-block bg-yellow-400 px-4 py-2 md:px-6 md:py-3 rounded-tr-3xl rounded-bl-3xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 -mt-4 lg:mt-0 relative z-10">
                                    <h1 className="text-[11px] xs:text-sm sm:text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter whitespace-nowrap">
                                        Celebrate Culture with Innovation
                                    </h1>
                                </div>
                                <div className="space-y-3 pt-0 md:pt-4">
                                    {/* Edukoot Image in Hero */}
                                    <div className="relative group max-w-lg mx-auto lg:mx-0 py-1 md:py-6">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-amber-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                        <img
                                            src="/assets/img/edukoot.jpg"
                                            alt="Edukoot Learning"
                                            className="relative rounded-2xl shadow-2xl border border-white/10 w-full h-auto object-cover transform transition-transform hover:scale-[1.02]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5 xs:gap-2 md:gap-4 max-w-xl mx-auto lg:mx-0 relative z-20">
                                {[
                                    { label: 'Registration', val: 'Jan 3–13', status: 'Open', borderClass: 'border-b-emerald-500', shadowClass: 'shadow-emerald-500/10', textClass: 'text-emerald-600' },
                                    { label: 'Submission', val: 'Jan 3–13', status: 'Live', borderClass: 'border-b-blue-500', shadowClass: 'shadow-blue-500/10', textClass: 'text-blue-600' },
                                    { label: 'Results', val: 'Jan 18', status: 'Upcoming', borderClass: 'border-b-amber-500', shadowClass: 'shadow-amber-500/10', textClass: 'text-amber-600' }
                                ].map((item, i) => (
                                    <div key={i} className={`group rounded-xl md:rounded-2xl bg-white border border-slate-100 border-b-4 ${item.borderClass} p-1.5 xs:p-2 md:p-5 shadow-lg ${item.shadowClass} transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-center min-h-[75px] md:min-h-0`}>
                                        <p className={`text-[8px] xs:text-[10px] font-black uppercase tracking-tight md:tracking-wider ${item.textClass} mb-0.5 md:mb-2 flex items-center justify-center lg:justify-start`}>
                                            {item.label}
                                        </p>
                                        <p className="text-xs xs:text-base md:text-2xl font-black text-slate-900 leading-tight mb-0.5">{item.status}</p>
                                        <p className="text-[8px] xs:text-[10px] md:text-xs text-slate-400 font-bold whitespace-nowrap">{item.val}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Hero Action Buttons - New Addition */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-xl mx-auto lg:mx-0">
                                <button
                                    onClick={() => document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' })}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Register Now <i className="fas fa-arrow-right"></i>
                                </button>
                                <button
                                    onClick={() => document.getElementById('submission-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Upload Project <i className="fas fa-cloud-upload-alt text-white"></i>
                                </button>
                            </div>
                        </div>

                        {/* Right Side: Glassmorphism Form */}
                        <div className="w-full max-w-md relative group">
                            {/* Glow Effect behind form */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-amber-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                            <div id="registration-form" className="relative bg-white rounded-[2rem] md:rounded-[2.2rem] overflow-hidden shadow-2xl p-5 md:p-10 border border-slate-100">
                                <div className="mb-6 md:mb-8 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Student Registration</h3>
                                        <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
                                    </div>
                                    <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                        <i className="fas fa-fingerprint text-xl text-blue-600"></i>
                                    </div>
                                </div>

                                {status.message && (
                                    <div className={`mb-6 p-4 rounded-2xl text-[11px] font-black border uppercase tracking-wider ${status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                        <i className={`fas ${status.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2 text-sm`}></i>
                                        {status.message}
                                    </div>
                                )}

                                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Participant Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i className="far fa-user text-slate-400 text-xs"></i>
                                            </div>
                                            <input required name="fullName" value={registrationData.fullName} onChange={handleRegisterChange} type="text" placeholder="Enter your full name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                                        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                                            {['School', 'College'].map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setRegistrationData({ ...registrationData, category: cat })}
                                                    className={`py-3 rounded-xl text-xs font-black transition-all ${registrationData.category === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                >
                                                    {cat} Student
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {registrationData.category === 'School' ? (
                                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Class / Standard</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fas fa-graduation-cap text-slate-400 text-xs"></i>
                                                </div>
                                                <select required name="standard" value={registrationData.standard} onChange={handleRegisterChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                                                    <option value="" className="text-slate-400">Select Standard</option>
                                                    {[...Array(12)].map((_, i) => (
                                                        <option key={i} value={`${i + 1}th Std`}>{i + 1}th Standard</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-xs">
                                                    <i className="fas fa-chevron-down"></i>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                            <div className="space-y-1.5">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Degree</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <i className="fas fa-user-graduate text-slate-400 text-xs"></i>
                                                    </div>
                                                    <select required name="degree" value={registrationData.degree} onChange={handleRegisterChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                                                        <option value="" className="text-slate-400">Select Degree</option>
                                                        {['BSc', 'MSc', 'BTech/BE', 'MTech/ME', 'BCA', 'MCA', 'BCom', 'Others'].map(deg => (
                                                            <option key={deg} value={deg}>{deg}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 text-xs">
                                                        <i className="fas fa-chevron-down"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <i className="fas fa-book-open text-slate-400 text-xs"></i>
                                                    </div>
                                                    <input required name="major" value={registrationData.major} onChange={handleRegisterChange} type="text" placeholder="e.g. Computer Science" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{registrationData.category === 'School' ? 'School Name' : 'College Name'}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i className="fas fa-university text-slate-400 text-xs"></i>
                                            </div>
                                            <input required name="instituteName" value={registrationData.instituteName} onChange={handleRegisterChange} type="text" placeholder={`Enter ${registrationData.category} Name`} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="far fa-envelope text-slate-400 text-xs"></i>
                                                </div>
                                                <input required name="emailId" value={registrationData.emailId} onChange={handleRegisterChange} type="email" placeholder="example@mail.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mobile Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fas fa-phone-alt text-slate-400 text-xs text-blue-600/50"></i>
                                                </div>
                                                <input required name="contactNumber" value={registrationData.contactNumber} onChange={handleRegisterChange} type="tel" placeholder="10-digit #" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 px-1 py-1">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                name="agreedToTerms"
                                                type="checkbox"
                                                required
                                                checked={registrationData.agreedToTerms}
                                                onChange={handleRegisterChange}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="terms" className="text-[11px] font-bold text-slate-500 leading-tight cursor-pointer">
                                            I agree to the <span onClick={(e) => { e.preventDefault(); document.getElementById('rules-section').scrollIntoView({ behavior: 'smooth' }); }} className="text-blue-600 underline hover:text-blue-800 transition-colors">Rules & Regulations</span> and confirm that I am a native of Virudhunagar District.
                                        </label>
                                    </div>

                                    <button disabled={isSubmitting} type="submit" className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-slate-900 active:scale-[0.98] disabled:opacity-50">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isSubmitting ? 'Registering...' : (
                                                <>Register Now <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i></>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* New Rules Section */}
            <section id="rules-section" className="py-20 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-sm font-black text-blue-600 uppercase tracking-[0.4em]">Guidelines</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
                            Rules & <span className="text-blue-600">Regulations</span>
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: "Eligibility", desc: "For Virudhunagar District students only. You might need to show proof.", icon: "fa-id-card" },
                            { title: "AI Tools", desc: "Use AI tools like Runway, Luma, Pika, or Kling AI to make your video.", icon: "fa-robot" },
                            { title: "Duration & Submit", desc: "Video must be 30-60s. Upload to Public Google Drive & share the link.", icon: "fa-cloud-upload-alt" },
                            { title: "Social Media", desc: "Post on Instagram. Tag @edukootlearn & @durkkasinnovations.", icon: "fa-hashtag" },
                            { title: "Audio", desc: "Use only royalty-free music to avoid disqualification.", icon: "fa-music" },
                            { title: "Judging", desc: "The judges’ decision is final.", icon: "fa-gavel" }
                        ].map((rule, i) => (
                            <div key={i} className="flex flex-col gap-4 bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all group">
                                <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl group-hover:scale-110 transition-transform">
                                    <i className={`fas ${rule.icon}`}></i>
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-lg uppercase tracking-wider mb-2">{rule.title}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed text-sm">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Verification Workflow Section */}
            <section className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -ml-48 -mt-48 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none"></div>

                <div className="relative mx-auto max-w-6xl px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Left Column: Instructions */}
                        <div className="space-y-8 text-left animate-in slide-in-from-left duration-700">
                            <div className="space-y-4">
                                <span className="text-sm font-black text-blue-600 uppercase tracking-[0.4em]">Final Step</span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                    Verification <br /><span className="text-blue-600">Process</span>
                                </h2>
                            </div>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                To complete your registration, you must post your video on Instagram.
                            </p>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shrink-0 shadow-sm">1</div>
                                    <p className="text-slate-600 font-medium text-sm leading-relaxed pt-1.5">
                                        Tag <span className="text-blue-600 font-bold">@edukootlearn</span> and <span className="text-blue-600 font-bold">@durkkasinnovations</span> in your post or reel.
                                    </p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shrink-0 shadow-sm">2</div>
                                    <p className="text-slate-600 font-medium text-sm leading-relaxed pt-1.5">
                                        Use the official hashtags provided in the list.
                                    </p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black text-xs shrink-0 shadow-sm">!</div>
                                    <p className="text-slate-900 font-bold text-sm leading-relaxed pt-1.5">
                                        Ensure your insta account is public to announce results on most view based
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Right Column: Actions */}
                        <div className="space-y-10 animate-in slide-in-from-right duration-700 delay-100">
                            {/* Follow Cluster */}
                            <div className="space-y-5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">1. Follow Us</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <a href="https://www.instagram.com/edukootlearn" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group shadow-sm hover:shadow-lg">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white text-xl shadow-lg">
                                            <i className="fab fa-instagram"></i>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-900">Edukoot Learn</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Education Hub</p>
                                        </div>
                                    </a>

                                    <a href="https://www.instagram.com/durkkasinnovations" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group shadow-sm hover:shadow-lg">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white text-xl shadow-lg">
                                            <i className="fab fa-instagram"></i>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-900">Durkkas Innovations</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Tech Partner</p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Hashtag Cluster */}
                            <div className="space-y-5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">2. Copy Hashtags</h4>
                                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-6 shadow-sm">
                                    <div className="flex flex-wrap gap-2">
                                        {hashtags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-wider shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleCopyHashtags}
                                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-slate-900 shadow-xl shadow-blue-500/20'}`}
                                    >
                                        {copied ? (
                                            <><i className="fas fa-check"></i> Copied to Clipboard</>
                                        ) : (
                                            <><i className="fas fa-copy"></i> Copy All Hashtags</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Judging & Awards Section */}
            <section className="mx-auto max-w-5xl px-4 pt-5 pb-24">
                <div className="grid gap-8 lg:gap-16 lg:grid-cols-2 items-start">
                    {/* Winner Selection Categories */}
                    <div className="space-y-8 md:space-y-10">
                        <div className="space-y-3 md:space-y-4">
                            <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight flex flex-col">
                                <span className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-[0.4em] mb-2 md:mb-4">The Criteria</span>
                                Judging <br />Criteria
                            </h2>
                            <p className="text-sm md:text-base text-slate-500 font-medium">Your entry will be judged on these three key points.</p>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            {[
                                { title: "Traditional", desc: "Best portrayal of Pongal traditions and cultural values.", icon: "fas fa-sun", color: "from-blue-500 to-red-500" },
                                { title: "Innovation", desc: "Creative and Impactful Use of AI and Technology.", icon: "fas fa-microchip", color: "from-blue-500 to-indigo-600" },
                                { title: "Most Liked", desc: "Based on genuine engagement (likes) on Instagram.", icon: "fas fa-heart", color: "from-pink-500 to-rose-600" }
                            ].map((cat, idx) => (
                                <div key={idx} className="group relative flex items-start gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10">
                                    <div className={`h-12 w-12 md:h-14 md:w-14 flex-shrink-0 rounded-xl md:rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform mt-1`}>
                                        <i className={cat.icon}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-base md:text-lg uppercase tracking-tight mb-1">{cat.title}</h4>
                                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* Rewards Section */}
                    <div className="lg:sticky lg:top-10 space-y-10">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/20">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                            <div className="relative space-y-8">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-200">Prizes</span>
                                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">What You <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200">Win</span></h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Gold Award */}
                                    <div className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors group">
                                        <div className="h-10 w-10 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center text-lg flex-shrink-0 border border-yellow-400/30 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                            <i className="fas fa-trophy"></i>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-white text-sm uppercase tracking-wide group-hover:text-yellow-300 transition-colors">Best Innovation / Creativity</h5>
                                            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Gold Award</p>
                                        </div>
                                    </div>

                                    {/* Silver Award */}
                                    <div className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors group">
                                        <div className="h-10 w-10 rounded-full bg-slate-300/20 text-slate-200 flex items-center justify-center text-lg flex-shrink-0 border border-slate-300/30 shadow-[0_0_15px_rgba(203,213,225,0.3)]">
                                            <i className="fas fa-medal"></i>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-white text-sm uppercase tracking-wide group-hover:text-slate-200 transition-colors">Best Storyline / Concept</h5>
                                            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Silver Award</p>
                                        </div>
                                    </div>

                                    {/* Public Choice Award */}
                                    <div className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors group">
                                        <div className="h-10 w-10 rounded-full bg-rose-400/20 text-rose-300 flex items-center justify-center text-lg flex-shrink-0 border border-rose-400/30 shadow-[0_0_15px_rgba(251,113,133,0.3)] animate-pulse">
                                            <i className="fas fa-heart"></i>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-white text-sm uppercase tracking-wide group-hover:text-rose-300 transition-colors">Public Choice Award</h5>
                                            <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Most Liked</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/20 space-y-4">
                                    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-start gap-3">
                                        <i className="fas fa-user-shield text-blue-200 mt-1"></i>
                                        <p className="text-[11px] font-bold text-blue-50 leading-relaxed text-left">
                                            <span className="text-white uppercase tracking-wider block mb-1">Native Verification</span>
                                            We will verify your native proof (Virudhunagar District) before awarding prizes.
                                        </p>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 text-center">Everyone who participates gets a Digital Certificate.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Submission Section - Moved to End */}
            <section id="submission-section" className="relative bg-slate-50 py-16 lg:py-24 overflow-hidden">
                <div className="relative mx-auto max-w-6xl px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <div className="space-y-4">
                                <span className="block text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-[0.5em] mb-2">Submission</span>
                                <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                    Upload Your Project <br />
                                    <span className="text-blue-600">Share Your Creativity</span>
                                </h2>
                            </div>
                            <p className="text-base md:text-lg text-slate-500 font-medium max-w-md mx-auto lg:mx-0">
                                Once you have registered, use this section to submit your <span className="text-slate-900 font-bold">Google Drive video link</span> and <span className="text-slate-900 font-bold">Instagram post link</span>.
                            </p>
                        </div>

                        <div className="w-full lg:flex-1 max-w-lg">
                            <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100">
                                {subStatus.message && (
                                    <div className={`mb-8 p-4 rounded-xl text-xs font-bold border ${subStatus.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                        {subStatus.message}
                                    </div>
                                )}

                                <form onSubmit={submissionStep === 1 ? handleEmailValidation : handleVideoSubmit} className="space-y-8">
                                    {submissionStep === 1 ? (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Enter Registered Email</label>
                                                <input required name="emailId" value={submissionData.emailId} onChange={handleSubmissionChange} type="email" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold" placeholder="yourname@email.com" />
                                            </div>
                                            <button disabled={subIsSubmitting} type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all">
                                                {subIsSubmitting ? 'Checking...' : 'Verify Email'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Google Drive Link</label>
                                                    <input required name="driveLink" value={submissionData.driveLink} onChange={handleSubmissionChange} type="url" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Paste your Drive link here" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instagram Post Link</label>
                                                    <input required name="instagramLink" value={submissionData.instagramLink} onChange={handleSubmissionChange} type="url" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Paste your Instagram link here" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <button disabled={subIsSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all shadow-blue-500/20">
                                                    {subIsSubmitting ? 'Submitting...' : 'Submit Project'}
                                                </button>
                                                <button type="button" onClick={() => setSubmissionStep(1)} className="w-full text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest py-2">Use Different Email</button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSuccessModal(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-amber-600"></div>
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <i className="fas fa-check-circle text-4xl text-emerald-500"></i>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Registration <br /><span className="text-blue-600">Successful!</span></h3>
                            <p className="text-sm text-slate-500 font-medium mb-8">You have successfully registered! Your ID is:</p>

                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 mb-8">
                                <span className="text-2xl font-black text-slate-900 tracking-widest uppercase">{regId}</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl"
                                >
                                    Proceed to Submission
                                </button>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">We have received your details.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Call Button */}
            <a
                href="tel:+917812876787"
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 shadow-lg transition-all hover:bg-orange-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-300 animate-bounce"
                aria-label="Call Now"
            >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            </a>
        </div>
    );
};

export default ViruthaiPongalPage;
