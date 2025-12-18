import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const MathProjectUpload = () => {
    const [formData, setFormData] = useState({
        emailId: '',
        contactNumber: '',
        registrationId: '', // Auto-fetched
        fullName: '', // Auto-fetched
        competitionCourse: '', // Auto-fetched
    });

    const [file, setFile] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleEmailBlur = async () => {
        if (!formData.emailId || !formData.emailId.includes('@')) return;

        setIsSearching(true);
        setStatus({ type: '', message: '' });

        try {
            const { data, error } = await supabase
                .from('math_lead_registrations')
                .select('id, full_name, competition_course') // Assuming 'id' is the registration ID or we generate one
                .eq('email_id', formData.emailId.trim())
                .single();

            if (error || !data) {
                setFormData(prev => ({ ...prev, registrationId: '', fullName: '', competitionCourse: '' }));
                setStatus({ type: 'error', message: 'Email not registered. Please check your registration.' });
            } else {
                // Construct a readable Registration ID if not present in DB, or use ID
                // Format requirement: RegistrationID_Email... so we need a stable ID.
                // If DB has a specific string ID, use it. Otherwise use the integer ID or construct one.
                // Assuming 'id' is available. Let's format it as MATH2025-{ID} for display if it's an int.
                const regId = data.registration_id || `MATH2025-${data.id.toString().padStart(4, '0')}`;

                setFormData(prev => ({
                    ...prev,
                    registrationId: regId,
                    fullName: data.full_name,
                    competitionCourse: data.competition_course || ''
                }));
                setStatus({ type: 'success', message: `Welcome, ${data.full_name}!` });
            }
        } catch (err) {
            console.error('Error fetching registration:', err);
            setStatus({ type: 'error', message: 'Error checking registration. Please try again.' });
        } finally {
            setIsSearching(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validation: Type
            const allowedTypes = [
                'application/pdf',
                'application/vnd.ms-powerpoint', // .ppt
                'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
            ];

            if (!allowedTypes.includes(selectedFile.type)) {
                setStatus({ type: 'error', message: 'Invalid file type. Please upload PDF, PPT, or PPTX.' });
                setFile(null);
                e.target.value = null;
                return;
            }

            // Validation: Size (10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setStatus({ type: 'error', message: 'File is too large. Max size is 10MB.' });
                setFile(null);
                e.target.value = null;
                return;
            }

            setFile(selectedFile);
            setStatus({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.registrationId) {
            setStatus({ type: 'error', message: 'Please enter a registered email ID first.' });
            return;
        }
        if (!file) {
            setStatus({ type: 'error', message: 'Please select a file to upload.' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: 'info', message: 'Uploading project...' });

        try {
            // 1. Rename File
            const fileExt = file.name.split('.').pop();
            const sanitizedEmail = formData.emailId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10); // Shorten for filename
            const timestamp = Math.floor(Date.now() / 1000);
            const newFileName = `${formData.registrationId}_${sanitizedEmail}_${timestamp}.${fileExt}`;
            const filePath = `math_day_2025/${newFileName}`;

            // 2. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('uploads') // Assuming 'uploads' bucket exists, with 'math_day_2025' folder
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                throw new Error(uploadError.message || 'Failed to upload file. Please try again.');
            }

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('math_project_uploads')
                .insert([{
                    registration_id: formData.registrationId,
                    email_id: formData.emailId,
                    full_name: formData.fullName,
                    competition_course: formData.competitionCourse,
                    file_path: filePath,
                    file_type: fileExt,
                    status: 'uploaded',
                    // uploaded_at is usually auto-set by default now(), but we can pass it if needed
                }]);

            if (dbError) {
                throw dbError;
            }

            setStatus({ type: 'success', message: 'Project uploaded successfully!' });
            // Reset file input
            setFile(null);
            // Optional: Reset form or keep details visible
        } catch (err) {
            console.error('Submission error:', err);
            setStatus({ type: 'error', message: err.message || 'Failed to submit project.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-16">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#1e40af33,_transparent_70%)]" />
                <div className="relative mx-auto max-w-4xl px-4 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200 drop-shadow-sm mb-4">
                        Math Day 2025
                    </p>
                    <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                        Project Submission
                    </h1>
                    <p className="mt-4 text-lg text-blue-100/90">
                        Upload your PDF or PPT presentation for the competition.
                    </p>
                </div>
            </section>

            {/* Upload Form Section */}
            <section className="py-12 px-4">
                <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-900/5 sm:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Status Message */}
                        {status.message && (
                            <div className={`rounded-md p-4 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
                                status.type === 'error' ? 'bg-red-50 text-red-700' :
                                    'bg-blue-50 text-blue-700'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        {/* Email Lookup */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Registered Email ID <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.emailId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, emailId: e.target.value }))}
                                    onBlur={handleEmailBlur}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border"
                                    placeholder="Enter the email you registered with"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-3">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Registration details will be fetched automatically.
                            </p>
                        </div>

                        {/* Read-Only Registration Details */}
                        <div className={`rounded-xl p-4 border transition-all duration-300 ${formData.fullName ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Student Name
                                    </label>
                                    <div className="mt-1 text-base font-bold text-slate-900">
                                        {formData.fullName || '---'}
                                    </div>
                                </div>
                                {formData.fullName && (
                                    <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Number (Optional) */}
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-slate-700">
                                Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border"
                                placeholder="Confirmation will be sent here"
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Project File <span className="text-red-500">*</span>
                            </label>
                            <div className="group relative mt-2 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 transition-all hover:bg-slate-50 hover:border-blue-400">
                                <div className="text-center">
                                    {file ? (
                                        <div className="animate-fade-in">
                                            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-slate-900 break-all max-w-[200px] mx-auto">{file.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFile(null);
                                                }}
                                                className="mt-3 text-xs font-medium text-red-600 hover:text-red-700 underline"
                                            >
                                                Remove File
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <div className="flex text-sm text-slate-600 justify-center">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-bold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                                                    <span>Click to upload</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.ppt,.pptx" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2">PDF, PPT, PPTX up to 10MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.registrationId || !file}
                            className="w-full rounded-md bg-blue-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Uploading...' : 'Submit Project'}
                        </button>

                    </form>
                </div>
            </section>
        </div>
    );
};

export default MathProjectUpload;
