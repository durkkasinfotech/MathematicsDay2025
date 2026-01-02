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
            <section className="relative overflow-hidden py-12 md:py-20 lg:py-32 bg-slate-950">
                {/* Full Cover Background Image - Optimized for all screens */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/img/pongal_bg.png"
                        alt="Festive Background"
                        className="w-full h-full object-cover object-center opacity-90"
                    />
                    {/* Responsive Overlay Gradient - Balanced for all screen heights */}
                    <div className="absolute inset-0 bg-slate-950/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-slate-950/40 lg:to-transparent" />
                </div>

                <div className="relative mx-auto max-w-6xl px-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left Side: Content */}
                        <div className="flex-1 space-y-10 text-center lg:text-left">
                            <div className="space-y-6">
                                <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-200 drop-shadow-sm">
                                    District Level Event
                                </p>

                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-white animate-in fade-in slide-in-from-left duration-700">
                                    <span className="block bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent whitespace-normal md:whitespace-nowrap">
                                        Viruthai Pongal 2026
                                    </span>
                                    <span className="block text-xl md:text-3xl font-bold text-orange-100 mt-3 tracking-wide opacity-90 uppercase">
                                        AI Video Creation Contest
                                    </span>
                                </h1>

                                <div className="space-y-3 pt-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-200 mb-2 flex items-center gap-2">
                                        <span className="h-0.5 w-6 bg-orange-500/50"></span>
                                        Rules & Regulations
                                    </h4>
                                    {[
                                        { title: "Eligibility", desc: "Open exclusively for students native to Virudhunagar District. Proof of residence may be required." },
                                        { title: "Domain", desc: "AI Generation only. Entries must be strictly synthesized using tools like Runway, Luma, Pika, or Kling AI." },
                                        { title: "Duration", desc: "Digital creation must have a runtime of 30 seconds to 1 minute. Others will not be considered." },
                                        { title: "Transmission", desc: "Upload to Google Drive. Set permissions to 'Public' and share the link in the submission portal." },
                                        { title: "Social", desc: "Posting on Instagram is mandatory. Tag @edukootlearn and @durkkasinnovations with hashtags." },
                                        { title: "Audio", desc: "Only royalty-free music is permitted. Copyrighted audio will result in a ban." },
                                        { title: "Decision", desc: "Judges’ decision will be final. No arguments allowed." }
                                    ].map((rule, i) => (
                                        <div key={i} className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-all">
                                            <div className="h-6 w-6 rounded-lg bg-orange-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg flex-shrink-0">{i + 1}</div>
                                            <p className="text-xs text-orange-50 text-left leading-relaxed">
                                                <span className="font-black text-white uppercase tracking-wider mr-1.5">{rule.title}:</span>
                                                {rule.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3 max-w-xl mx-auto lg:mx-0">
                                {[
                                    { label: 'Registration', val: 'Jan 2 – 13', status: 'Open', color: 'emerald', dot: true },
                                    { label: 'Submission', val: 'Jan 2 – 13', status: 'Live', color: 'orange', dot: true },
                                    { label: 'Result Update', val: 'Jan 14, 2026', status: 'Upcoming', color: 'amber', dot: true }
                                ].map((item, i) => (
                                    <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 shadow-2xl transition-all hover:bg-white/15">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-orange-100 mb-1 flex items-center justify-center lg:justify-start">
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
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                            <div className="relative bg-white rounded-[2.2rem] overflow-hidden shadow-2xl p-8 md:p-10 border border-slate-100">
                                <div className="mb-8 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registration Form</h3>
                                        <div className="h-1.5 w-12 bg-orange-600 rounded-full"></div>
                                    </div>
                                    <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100">
                                        <i className="fas fa-fingerprint text-xl text-orange-600"></i>
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
                                            <input required name="fullName" value={registrationData.fullName} onChange={handleRegisterChange} type="text" placeholder="Full Student Name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300" />
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
                                                    className={`py-3 rounded-xl text-xs font-black transition-all ${registrationData.category === cat ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
                                                <select required name="standard" value={registrationData.standard} onChange={handleRegisterChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer">
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
                                                    <select required name="degree" value={registrationData.degree} onChange={handleRegisterChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer">
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
                                                    <input required name="major" value={registrationData.major} onChange={handleRegisterChange} type="text" placeholder="e.g. Computer Science" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300" />
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
                                            <input required name="instituteName" value={registrationData.instituteName} onChange={handleRegisterChange} type="text" placeholder={`Enter your ${registrationData.category} name`} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="far fa-envelope text-slate-400 text-xs"></i>
                                                </div>
                                                <input required name="emailId" value={registrationData.emailId} onChange={handleRegisterChange} type="email" placeholder="example@mail.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contact</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <i className="fas fa-phone-alt text-slate-400 text-xs text-orange-600/50"></i>
                                                </div>
                                                <input required name="contactNumber" value={registrationData.contactNumber} onChange={handleRegisterChange} type="tel" placeholder="10-digit #" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300" />
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
                                                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="terms" className="text-[11px] font-bold text-slate-500 leading-tight cursor-pointer">
                                            I agree to the <span className="text-orange-600 underline">Rules & Regulations</span> and confirm that I am a native of Virudhunagar District.
                                        </label>
                                    </div>

                                    <button disabled={isSubmitting} type="submit" className="group relative w-full overflow-hidden rounded-2xl bg-orange-600 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-slate-900 active:scale-[0.98] disabled:opacity-50">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isSubmitting ? 'Syncing...' : (
                                                <>Submit Registration <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i></>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Submission Section */}
            <section className="relative bg-slate-50 py-16 lg:py-24 overflow-hidden">
                <div className="relative mx-auto max-w-6xl px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <div className="space-y-4">
                                <span className="text-sm font-black text-orange-600 uppercase tracking-[0.4em]">Submission Portal</span>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                                    Ready to Upload? <br />
                                    <span className="text-orange-600">Unleash Your Digital Vision</span>
                                </h2>
                            </div>
                            <p className="text-base md:text-lg text-slate-500 font-medium max-w-md mx-auto lg:mx-0">
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
                                            <button disabled={subIsSubmitting} type="submit" className="w-full bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all">
                                                {subIsSubmitting ? 'Verifying...' : 'Next Phase'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Google Drive Link</label>
                                                    <input required name="driveLink" value={submissionData.driveLink} onChange={handleSubmissionChange} type="url" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none" placeholder="https://drive.google.com/..." />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instagram Link</label>
                                                    <input required name="instagramLink" value={submissionData.instagramLink} onChange={handleSubmissionChange} type="url" className="w-full rounded-xl border-slate-100 bg-slate-50/50 px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none" placeholder="https://www.instagram.com/p/..." />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <button disabled={subIsSubmitting} type="submit" className="w-full bg-orange-600 hover:bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all shadow-orange-500/20">
                                                    {subIsSubmitting ? 'Transmitting...' : 'Final Submission'}
                                                </button>
                                                <button type="button" onClick={() => setSubmissionStep(1)} className="w-full text-[10px] font-bold text-slate-400 hover:text-orange-600 uppercase tracking-widest py-2">Revise Email</button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verification Workflow Section */}
            <section className="relative py-24 bg-gradient-to-b from-white via-orange-50/30 to-white overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -ml-48 -mt-48 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none"></div>

                <div className="relative mx-auto max-w-6xl px-4">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        {/* Left Side: Educational Branding Image */}
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute -inset-4 bg-orange-100/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-100">
                                <img
                                    src="/assets/img/edukoot.jpg"
                                    alt="Verification Workflow"
                                    className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            </div>
                        </div>

                        {/* Right Side: Structured Content */}
                        <div className="w-full lg:w-1/2 space-y-12 text-left">
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                    Verification <span className="text-orange-600">Workflow</span>
                                </h2>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    To finalize your entry, you must publish your AI creation on Instagram. You are required to tag <span className="text-orange-600 font-bold">@edukootlearn</span> and <span className="text-orange-600 font-bold">@durkkasinnovations</span> in your post. <br /><span className="text-slate-900 font-bold">To verify your entry, ensure that your Instagram account is set to Public</span> for us to verify your entry.
                                </p>
                            </div>

                            <div className="space-y-10">
                                {/* Follow Cluster */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Follow & Support Us</h4>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                        <a href="https://www.instagram.com/edukootlearn" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-white transition-all group shadow-sm hover:shadow-lg">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white text-lg shadow-lg">
                                                <i className="fab fa-instagram"></i>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-black text-slate-900">Edukoot Learn</p>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Education Hub</p>
                                            </div>
                                        </a>

                                        <a href="https://www.instagram.com/durkkasinnovations" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-white transition-all group shadow-sm hover:shadow-lg">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white text-lg shadow-lg">
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
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Copy & Paste Hashtags</h4>
                                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 space-y-6">
                                        <div className="flex flex-wrap gap-2">
                                            {hashtags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleCopyHashtags}
                                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-orange-600 text-white hover:bg-slate-900 shadow-xl shadow-orange-500/20'}`}
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
                </div>
            </section>

            {/* Judging & Awards Section */}
            <section className="mx-auto max-w-5xl px-4 py-24">
                <div className="grid gap-16 lg:grid-cols-2 items-start">
                    {/* Winner Selection Categories */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight flex flex-col">
                                <span className="text-sm font-black text-orange-600 uppercase tracking-[0.4em] mb-4">The Selection</span>
                                Categories for <br />Winner Selection
                            </h2>
                            <p className="text-base text-slate-500 font-medium">Participants will be evaluated across three distinct domains of excellence.</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: "Traditional", desc: "Best portrayal of Pongal traditions and cultural values.", icon: "fas fa-om", color: "from-orange-500 to-red-500" },
                                { title: "Innovation", desc: "Creative and Impactful Use of AI and Technology.", icon: "fas fa-microchip", color: "from-blue-500 to-indigo-600" },
                                { title: "Most Liked", desc: "Based on genuine engagement (likes) on Instagram.", icon: "fas fa-heart", color: "from-pink-500 to-rose-600" }
                            ].map((cat, idx) => (
                                <div key={idx} className="group relative flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10">
                                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform`}>
                                        <i className={cat.icon}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{cat.title}</h4>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rewards Section */}
                    <div className="lg:sticky lg:top-10 space-y-10">
                        <div className="bg-[#0a0c1b] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                            <div className="relative space-y-8">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400">Excellence Rewarded</span>
                                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Awards for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Achievers</span></h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 flex-shrink-0">
                                            <i className="fas fa-certificate text-xl"></i>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-white uppercase tracking-wider mb-1">Elite Recognition</h5>
                                            <p className="text-sm text-orange-100/60 font-medium leading-relaxed">Official Physical Certificate of Achievement for top-tier creators.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                            <i className="fas fa-gift text-xl"></i>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-white uppercase tracking-wider mb-1">Digital Scholarship</h5>
                                            <p className="text-sm text-orange-100/60 font-medium leading-relaxed">Edukoot offers full course access worth <span className="text-white font-black underline decoration-orange-500">₹6,000</span> and lifetime free membership.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10 space-y-4">
                                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-start gap-3">
                                        <i className="fas fa-user-shield text-orange-400 mt-1"></i>
                                        <p className="text-[11px] font-bold text-orange-100/80 leading-relaxed text-left">
                                            <span className="text-orange-400 uppercase tracking-wider block mb-1">Authenticity Check</span>
                                            Prizes will be awarded only after a mandatory cross-verification of your <span className="text-white">Virudhunagar District native status</span>.
                                        </p>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400/80 text-center">Every valid entry earns a digital token of participation.</p>
                                </div>
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
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-600"></div>
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <i className="fas fa-check-circle text-4xl text-emerald-500"></i>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Registration <br /><span className="text-orange-600">Successful!</span></h3>
                            <p className="text-sm text-slate-500 font-medium mb-8">Welcome to Viruthai Pongal 2026. Your official ID is:</p>

                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 mb-8">
                                <span className="text-2xl font-black text-slate-900 tracking-widest uppercase">{regId}</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl"
                                >
                                    Proceed to Submission
                                </button>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">A confirmation has been logged.</p>
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
