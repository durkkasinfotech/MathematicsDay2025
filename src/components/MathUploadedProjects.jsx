import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const MathUploadedProjects = () => {
    const navigate = useNavigate();
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('math_project_uploads')
                .select('*')
                .order('uploaded_at', { ascending: false });

            if (error) throw error;
            setUploads(data || []);
        } catch (err) {
            console.error('Error fetching uploads:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getFileUrl = (path) => {
        const { data } = supabase.storage.from('uploads').getPublicUrl(path);
        return data.publicUrl;
    };

    const filteredUploads = uploads.filter(upload =>
        upload.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.registration_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-2">
                            <Link to="/admin" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                                Dashboard
                            </Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Math Day 2025</span>
                        </div>
                        <h2 className="text-3xl font-bold leading-7 text-slate-900 sm:truncate">
                            Project Submissions
                        </h2>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
                        <button
                            onClick={fetchUploads}
                            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Refresh List
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative max-w-md w-full">
                            <input
                                type="text"
                                placeholder="Search by name, email, or registration ID..."
                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Total Submissions: {uploads.length}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Reg ID</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Asset</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Uploaded</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center">
                                            <div className="flex justify-center">
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"></div>
                                            </div>
                                            <p className="mt-2 text-sm text-slate-500">Loading uploads...</p>
                                        </td>
                                    </tr>
                                ) : filteredUploads.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-sm text-slate-500">
                                            No uploads found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUploads.map((upload) => (
                                        <tr key={upload.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{upload.registration_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-bold text-slate-900">{upload.full_name}</div>
                                                <div className="text-xs text-slate-500">{upload.email_id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{upload.competition_course}</div>
                                                <a
                                                    href={getFileUrl(upload.file_path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all"
                                                >
                                                    <i className="fas fa-file-download text-xs"></i>
                                                    {upload.file_type?.toUpperCase()}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                {new Date(upload.uploaded_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                                                    {upload.status || 'Received'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MathUploadedProjects;
