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

            setStatus({
                type: 'success',
                message: `Registration Successful! Your ID is: ${data.registration_no}. You can now submit your video below.`
            });
            setRegistrationData({
                fullName: '',
                category: 'School',
                standard: '',
                degree: '',
                major: '',
                instituteName: '',
                emailId: '',
                contactNumber: ''
            });
            setTimeout(() => {
                setStatus({ type: '', message: '' });
            }, 5000);

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
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-16 lg:py-28">
                {/* Advanced Background Elements */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#1e40af33,_transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,_transparent_30%,_#3b82f611_50%,_transparent_70%)] pointer-events-none" />

                {/* SVG Mesh Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

                <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left Side: Content */}
                        <div className="flex-1 space-y-10 text-center lg:text-left">
                            <div className="space-y-6">
                                <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200 drop-shadow-sm">
                                    District Level Event
                                </p>

                                <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-white animate-in fade-in slide-in-from-left duration-700">
                                    <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                        Viruthai Pongal 2026
                                    </span>
                                    <span className="block text-2xl md:text-3xl font-bold text-blue-100 mt-3 tracking-wide opacity-90">
                                        AI Video Creation Contest
                                    </span>
                                </h1>

                                <p className="mx-auto lg:mx-0 max-w-xl text-base md:text-lg text-white leading-relaxed font-medium">
                                    Exclusively for School & College students of <br className="hidden md:block" />
                                    <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">Virudhunagar District</span>. Showcase your digital innovation.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3 max-w-xl mx-auto lg:mx-0">
                                {[
                                    { label: 'Registration', val: 'Jan 2 – 13', status: 'Open', color: 'emerald', dot: true },
                                    { label: 'Submission', val: 'Jan 2 – 13', status: 'Live', color: 'blue', dot: true },
                                    { label: 'Result Update', val: 'Jan 14, 2026', status: 'Upcoming', color: 'amber', dot: true }
                                ].map((item, i) => (
                                    <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 shadow-2xl transition-all hover:bg-white/15">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-100 mb-1 flex items-center justify-center lg:justify-start">
                                            {item.label}
                                            {item.dot && (
                                                <span className={`ml-2 inline-block h-2 w-2 rounded-full bg-${item.color}-400 animate-pulse`}></span>
                                            )}
                                        </p>
                                        <p className="text-base font-bold text-white">{item.status}</p>
                                        <p className="text-[11px] text-white font-medium">{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Glassmorphism Form */}
                        <div className="w-full max-w-md relative group">
                            {/* Glow Effect behind form */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                            <div className="relative bg-white rounded-[2.2rem] overflow-hidden shadow-2xl p-8 md:p-10 border border-slate-100">
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Portal Entry</h3>
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
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i className="far fa-user text-slate-400 text-xs"></i>
                                            </div>
                                            <input required name="fullName" value={registrationData.fullName} onChange={handleRegisterChange} type="text" placeholder="Full Student Name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Classification Target</label>
                                        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                                            {['School', 'College'].map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setRegistrationData({ ...registrationData, category: cat })}
                                                    className={`py-3 rounded-xl text-xs font-black transition-all ${registrationData.category === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {registrationData.category === 'School' ? (
                                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-500">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Level</label>
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
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Degree Program</label>
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
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{registrationData.category === 'School' ? 'School Authority' : 'Institution Name'}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i className="fas fa-university text-slate-400 text-xs"></i>
                                            </div>
                                            <input required name="instituteName" value={registrationData.instituteName} onChange={handleRegisterChange} type="text" placeholder={`Enter your ${registrationData.category} name`} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="far fa-envelope text-slate-400 text-xs"></i>
                                                </div>
                                                <input required name="emailId" value={registrationData.emailId} onChange={handleRegisterChange} type="email" placeholder="example@mail.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fas fa-phone-alt text-slate-400 text-xs text-blue-600/50"></i>
                                                </div>
                                                <input required name="contactNumber" value={registrationData.contactNumber} onChange={handleRegisterChange} type="tel" placeholder="10-digit #" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <button disabled={isSubmitting} type="submit" className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-slate-900 active:scale-[0.98] disabled:opacity-50">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isSubmitting ? 'Syncing...' : (
                                                <>Authorize Registration <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i></>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Showcase Section */}
            <section className="py-12 bg-white px-4">
                <div className="mx-auto max-w-5xl relative group overflow-hidden rounded-3xl shadow-lg border border-slate-100">
                    <img src="/assets/img/edukoot.jpg" alt="Showcase" className="w-full h-auto object-contain transition-transform duration-[2s] group-hover:scale-105" />
                    <div className="absolute bottom-6 left-6 z-20">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                            Innovation Hub
                        </div>
                    </div>
                </div>
            </section>

            {/* Submission Section */}
            <section className="relative bg-slate-50 py-16 lg:py-24 overflow-hidden">
                <div className="relative mx-auto max-w-6xl px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                                Unleash Your <br /><span className="text-blue-600">Digital Vision</span>
                            </h2>
                            <p className="text-base md:text-lg text-slate-500 font-medium max-w-md">
                                Finalize your entry by uploading your <span className="text-slate-900 font-bold">Google Drive video</span> and <span className="text-slate-900 font-bold">Instagram post links</span> to the judging panel.
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
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Registered Email</label>
                                                <input required name="emailId" value={submissionData.emailId} onChange={handleSubmissionChange} type="email" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-6 py-4 text-sm font-bold" placeholder="Enter registration email" />
                                            </div>
                                            <button disabled={subIsSubmitting} type="submit" className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all">
                                                {subIsSubmitting ? 'Verifying...' : 'Next Phase'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Google Drive Link</label>
                                                    <input required name="driveLink" value={submissionData.driveLink} onChange={handleSubmissionChange} type="url" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold" placeholder="https://drive.google.com/..." />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instagram Link</label>
                                                    <input required name="instagramLink" value={submissionData.instagramLink} onChange={handleSubmissionChange} type="url" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold" placeholder="https://www.instagram.com/p/..." />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <button disabled={subIsSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all">
                                                    {subIsSubmitting ? 'Transmitting...' : 'Final Submission'}
                                                </button>
                                                <button type="button" onClick={() => setSubmissionStep(1)} className="w-full text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest py-2">Revise Email</button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rules Section */}
            <section className="mx-auto max-w-5xl px-4 py-20 border-t border-slate-100">
                <div className="grid gap-16 lg:grid-cols-2 items-start">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase">Protocol & Standards</h2>
                            <p className="text-base text-slate-500 font-medium">To ensure a fair competition, all participants must follow this framework.</p>
                        </div>
                        <div className="grid gap-6">
                            {[
                                {
                                    title: "Domain",
                                    desc: "AI Generation only. Entries must be strictly synthesized using Artificial Intelligence tools such as Runway, Luma, Pika, or Kling AI."
                                },
                                {
                                    title: "Duration",
                                    desc: "The digital creation must have a runtime of 30 seconds to 1 minute. Videos outside this range will not be considered."
                                },
                                {
                                    title: "Transmission Protocol",
                                    desc: "Upload your final work to your personal Google Drive. The sharing permissions MUST be set to 'Anyone with the link' (Public) to allow our judges access. Simply share the generated link in the submission portal."
                                },
                                {
                                    title: "Social Validation",
                                    desc: "Posting on Instagram is mandatory. Tag @edukootlearn and @durkkasinnovations and incorporate the official campaign hashtags. This step is essential for creator verification and leaderboard eligibility."
                                }
                            ].map((rule, idx) => (
                                <div key={idx} className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white font-bold text-sm">{idx + 1}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg uppercase mb-2 tracking-tight">{rule.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{rule.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                                <i className="fab fa-instagram text-2xl"></i>
                                Verification Workflow
                            </h3>
                            <div className="space-y-6">
                                <p className="text-sm text-blue-100/90 leading-relaxed font-medium">
                                    To finalize your entry, you must publish your AI creation on Instagram. You are required to tag <span className="text-white font-bold underline">@edukootlearn</span> and <span className="text-white font-bold underline">@durkkasinnovations</span> in your post.
                                </p>

                                <div className="space-y-4">
                                    <p className="text-[11px] uppercase tracking-widest text-blue-200 font-bold">Follow & Support Us</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <a
                                            href="https://www.instagram.com/edukootlearn/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <i className="fab fa-instagram text-xl text-pink-400 group-hover:scale-110 transition-transform"></i>
                                                <span className="text-xs font-bold tracking-tight">Edukoot Learn</span>
                                            </div>
                                            <i className="fas fa-external-link-alt text-[10px] text-white/40"></i>
                                        </a>
                                        <a
                                            href="https://www.instagram.com/durkkasinnovations/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-xl transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <i className="fab fa-instagram text-xl text-pink-400 group-hover:scale-110 transition-transform"></i>
                                                <span className="text-xs font-bold tracking-tight">Durkkas Innovations</span>
                                            </div>
                                            <i className="fas fa-external-link-alt text-[10px] text-white/40"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 border-dashed">
                                    <p className="text-[11px] uppercase tracking-widest text-blue-200 font-bold mb-3">Copy & Paste Hashtags</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {hashtags.map(t => <span key={t} className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[10px] font-mono text-blue-100">{t}</span>)}
                                    </div>
                                    <button onClick={handleCopyHashtags} className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                        {copied ? 'Copied to Clipboard!' : 'Copy All Hashtags'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-blue-200/60 italic text-center leading-tight">
                                    *Ensure your profile is set to Public during the competition period for manual verification of tags.
                                </p>
                            </div>
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

export default ViruthaiPongalPage;
