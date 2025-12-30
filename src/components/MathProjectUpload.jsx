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
        setStatus({ type: 'info', message: 'Checking for existing uploads...' });

        try {
            // Check if this email has already uploaded a project
            const { data: existingUpload, error: checkError } = await supabase
                .from('math_project_uploads')
                .select('id, email_id')
                .eq('email_id', formData.emailId.trim())
                .limit(1);

            if (checkError) {
                console.error('Error checking existing uploads:', checkError);
                throw new Error('Failed to verify upload status. Please try again.');
            }

            if (existingUpload && existingUpload.length > 0) {
                setStatus({
                    type: 'error',
                    message: 'You have already uploaded a project. Each email can only submit once. If you need to update your submission, please contact the organizers.'
                });
                setIsSubmitting(false);
                return;
            }

            setStatus({ type: 'info', message: 'Uploading project...' });

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
                    {/* Event Over Message */}
                    <div className="text-center py-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m1-11a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Submissions Closed</h2>
                        <p className="text-slate-600 mb-8">
                            Mathematics Day 2025 has concluded and project submissions are no longer being accepted.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.href = 'https://darecentre.in/'}
                                className="w-full rounded-md bg-blue-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all font-bold"
                            >
                                Back to Homepage
                            </button>
                            <p className="text-xs text-slate-400">
                                If you need assistance, please contact the organizers.
                            </p>
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

export default MathProjectUpload;
