import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const MathUploadedProjects = () => {
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
        // Construct public URL for the file
        // Assumes 'uploads' bucket is public
        const { data } = supabase.storage.from('uploads').getPublicUrl(path);
        return data.publicUrl;
    };

    const filteredUploads = uploads.filter(upload =>
        upload.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.registration_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-3xl font-bold text-slate-900">Math Day 2025 - Project Submissions</h1>
                        <p className="mt-2 text-sm text-slate-700">
                            A list of all student project uploads.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={fetchUploads}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Refresh List
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-8 max-w-md">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            placeholder="Search by Name, Email, or Reg ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-slate-300 bg-white">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                                                Registration ID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                Student Details
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                Category
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                File
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                Uploaded At
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                                Status
                                            </th>
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
                                                <tr key={upload.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                                        {upload.registration_id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                        <div className="font-medium text-slate-900">{upload.full_name}</div>
                                                        <div className="text-slate-500">{upload.email_id}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                        {upload.competition_course || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                        <a
                                                            href={getFileUrl(upload.file_path)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                                        >
                                                            <svg className="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            View / Download {upload.file_type?.toUpperCase()}
                                                        </a>
                                                        <div className="mt-1 text-xs text-slate-400 font-mono truncate max-w-[150px]" title={upload.file_path}>
                                                            {upload.file_path.split('/').pop()}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                        {new Date(upload.uploaded_at).toLocaleString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                        <span className="inline-flex rounded-full bg-emerald-100 px-2 text-xs font-semibold leading-5 text-emerald-800">
                                                            {upload.status}
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
            </div>
        </div>
    );
};

export default MathUploadedProjects;
