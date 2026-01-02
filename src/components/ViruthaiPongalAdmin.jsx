import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const ViruthaiPongalAdmin = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('registrations');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: regData, error: regError } = await supabase
                .from('viruthaipongal_registrations')
                .select('*')
                .order('registration_date', { ascending: false });

            if (regError) throw regError;
            setRegistrations(regData || []);

            const { data: subData, error: subError } = await supabase
                .from('viruthaipongal_submissions')
                .select('*')
                .order('submitted_at', { ascending: false });

            if (subError) throw subError;
            setSubmissions(subData || []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            alert('Failed to fetch data. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin/login');
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.institute_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.standard?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.degree?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.major?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSubmissions = submissions.filter(sub =>
        sub.email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.drive_link?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-2">
                            <Link to="/admin" className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                                Dashboard
                            </Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Viruthai Pongal Admin</span>
                        </div>
                        <h2 className="text-3xl font-bold leading-7 text-slate-900 sm:truncate">
                            Management Portal
                        </h2>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
                        <button
                            onClick={fetchData}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 shadow-sm text-sm hover:bg-red-100 transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Tabs & Search */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                            <button
                                onClick={() => setActiveTab('registrations')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'registrations' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Registrations ({registrations.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('submissions')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'submissions' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Submissions ({submissions.length})
                            </button>
                        </div>

                        <div className="relative max-w-sm w-full">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                {activeTab === 'registrations' ? (
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">ID</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Category / Level</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Institute</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Institute</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Video Link</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Instagram Link</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Submitted At</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                                <span className="text-sm text-slate-400 font-medium">Crunching data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (activeTab === 'registrations' ? filteredRegistrations : filteredSubmissions).length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                                            No records matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    (activeTab === 'registrations' ? filteredRegistrations : filteredSubmissions).map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            {activeTab === 'registrations' ? (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{item.registration_no}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-slate-900">{item.full_name}</div>
                                                        <div className="text-xs text-slate-500">{item.email_id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-slate-900">{item.category}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {item.category === 'School' ? item.standard : `${item.degree} - ${item.major}`}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{item.institute_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{item.contact_number}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                        {new Date(item.registration_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {submissions.some(s => s.email_id === item.email_id) ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                                                                Video Uploaded
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                                                                Pending Submission
                                                            </span>
                                                        )}
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-slate-900">
                                                            {registrations.find(r => r.email_id === item.email_id)?.full_name || 'Unknown'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{item.email_id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                                        {registrations.find(r => r.email_id === item.email_id)?.institute_name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <a
                                                            href={item.drive_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all"
                                                        >
                                                            <i className="fab fa-google-drive"></i>
                                                            Drive
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.instagram_link ? (
                                                            <a
                                                                href={item.instagram_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 font-bold text-sm bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100 transition-all"
                                                            >
                                                                <i className="fab fa-instagram"></i>
                                                                Instagram
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 font-italic">No link</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                        {new Date(item.submitted_at).toLocaleString()}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ViruthaiPongalAdmin;
