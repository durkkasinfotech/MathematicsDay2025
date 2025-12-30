import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Simple hardcoded check for demonstration - in production use Supabase Auth
        // I will use a simple check for now, but inform how to use real auth
        if (email === 'admin@darecentre.in' && password === 'Dkit@2012') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Invalid credentials. Please contact developer.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-40 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[120px] opacity-40 -ml-20 -mb-20"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Gateway</h1>
                        <p className="text-slate-400 text-sm mt-2 font-medium">Please sign in to access management tools.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Account Identifier</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                                placeholder="Password"
                            />
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4"
                        >
                            {isSubmitting ? 'Verifying...' : 'Authenticate Access'}
                            {!isSubmitting && <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Secured Institutional Portal</p>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-400 text-sm">
                    Forgotten credentials? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Support Gateway</span>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
