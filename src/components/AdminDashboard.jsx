import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const panels = [
        {
            name: "Viruthai Pongal 2026",
            description: "View registrations and video submissions.",
            link: "/admin/viruthai",
            icon: "🏆",
            color: "from-indigo-500 to-purple-600"
        },
        {
            name: "Math Day 2025",
            description: "View uploaded student projects.",
            link: "/admin/math",
            icon: "📐",
            color: "from-blue-500 to-blue-700"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Super Admin Dashboard</h1>
                        <p className="text-slate-500 mt-2 font-medium">Central management console for all event data.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 hover:bg-red-100 transition-all active:scale-95"
                    >
                        Sign Out
                    </button>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {panels.map((panel, idx) => (
                        <Link
                            key={idx}
                            to={panel.link}
                            className="group relative bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${panel.color} opacity-5 rounded-bl-[100px] transition-all group-hover:opacity-10`}></div>
                            <div className="relative z-10">
                                <span className="text-4xl mb-6 block">{panel.icon}</span>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{panel.name}</h3>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{panel.description}</p>
                                <div className="inline-flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest group-hover:gap-4 transition-all">
                                    Manage Data <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Institutional Data Gateway - Dare Centre</p>
                </footer>
            </div>
        </div>
    );
};

export default AdminDashboard;
