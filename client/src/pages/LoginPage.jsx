import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { setUser } from '../slices/authSlice';
import { loginAPI, registerAPI } from '../api/authAPI';

const checkStrength = (v) => {
  let s = 0;
  if (v.length >= 6) s++;
  if (v.length >= 10) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const colors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#10B981'];
  const widths = ['0%', '20%', '40%', '60%', '85%', '100%'];
  return { text: levels[s], color: colors[s], width: widths[s] };
};

const Field = ({ label, icon: Icon, type, value, onChange,
                 placeholder, right }) => (
  <div>
    <label className="text-[11px] font-medium text-gray-500
                      dark:text-gray-400 mb-1.5 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2
                       text-gray-400" size={14} />
      <input type={type} value={value} onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px]
                   bg-gray-50 dark:bg-[#14142A]
                   border border-gray-200 dark:border-white/[0.08]
                   text-gray-800 dark:text-gray-200
                   placeholder-gray-400 outline-none
                   focus:border-primary transition-colors" />
      {right}
    </div>
  </div>
);

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);
  const from      = location.state?.from || '/';
  const initTab   = new URLSearchParams(location.search).get('tab') === 'register'
                    ? 'register' : 'login';

  const [tab, setTab]           = useState(initTab);
  const [loading, setLoading]   = useState(false);
  const [showLP, setShowLP]     = useState(false);
  const [showRP, setShowRP]     = useState(false);
  const [strength, setStrength] = useState({ text: '', color: '', width: '0%' });

  const [ld, setLd] = useState({ email: '', password: '' });
  const [rd, setRd] = useState({ name: '', email: '', password: '' });

  useEffect(() => { if (user) navigate(from, { replace: true }); }, [user]);

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!ld.email || !ld.password) return toast.error('Fill all fields');
    try {
      setLoading(true);
      const { data } = await loginAPI(ld);
      dispatch(setUser(data));
      toast.success(`Welcome back, ${data.name}! 👋`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  /* ── Register ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!rd.name || !rd.email || !rd.password) return toast.error('Fill all fields');
    if (rd.password.length < 6) return toast.error('Password min. 6 characters');
    try {
      setLoading(true);
      const { data } = await registerAPI(rd);
      dispatch(setUser(data));
      toast.success(`Welcome to ShopSphere, ${data.name}! 🎉`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const GoogleBtn = ({ label }) => (
    <button type="button"
      className="w-full py-2.5 rounded-xl text-[13px]
                 bg-gray-50 dark:bg-[#14142A]
                 border border-gray-200 dark:border-white/[0.08]
                 text-gray-700 dark:text-gray-300
                 flex items-center justify-center gap-2
                 hover:border-primary transition-colors">
      <span className="w-4 h-4 rounded-full shrink-0"
        style={{ background: 'conic-gradient(#4285F4 0 25%,#EA4335 25% 50%,#FBBC05 50% 75%,#34A853 75%)' }} />
      {label}
    </button>
  );

  const Divider = ({ text }) => (
    <div className="flex items-center gap-3 text-[10px] text-gray-400">
      <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.08]" />
      {text}
      <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.08]" />
    </div>
  );

  return (
    <div className="page-bg min-h-screen flex items-center justify-center
                    relative overflow-hidden py-10">

      {/* Blobs */}
      <div className="absolute w-[440px] h-[440px] rounded-full -top-28 -left-20
                      bg-[rgba(99,102,241,0.35)] dark:bg-[rgba(99,102,241,0.42)]
                      blur-[88px] animate-blob-1 pointer-events-none" />
      <div className="absolute w-[330px] h-[330px] rounded-full top-16 -right-16
                      bg-[rgba(245,158,11,0.28)] dark:bg-[rgba(245,158,11,0.3)]
                      blur-[88px] animate-blob-2 pointer-events-none" />
      <div className="absolute w-[370px] h-[370px] rounded-full -bottom-28 left-[28%]
                      bg-[rgba(236,72,153,0.22)] dark:bg-[rgba(236,72,153,0.28)]
                      blur-[88px] animate-blob-3 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[360px] mx-4">
        <div className="glass-card rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="text-center pt-8 px-6">
            <button onClick={() => navigate('/')}
              className="text-[20px] font-medium text-gray-900 dark:text-white
                         tracking-tight hover:opacity-80 transition-opacity">
              Shop<span className="text-primary">Sphere</span>
            </button>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 mb-5">
              {tab === 'login'
                ? 'Welcome back! Sign in to continue.'
                : "Join ShopSphere — it's free!"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-6 mb-4">
            {[['login','Sign in'],['register','Create account']].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-xl text-[13px] font-medium
                            border transition-all duration-200
                  ${tab === t
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="overflow-hidden">
            <div className="flex"
              style={{
                width: '200%',
                transform: tab === 'login' ? 'translateX(0)' : 'translateX(-50%)',
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}>

              {/* ── Login form ── */}
              <div className="w-1/2 px-6 pb-6">
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <Field label="Email address" icon={FiMail} type="email"
                    value={ld.email} placeholder="you@email.com"
                    onChange={e => setLd({ ...ld, email: e.target.value })} />

                  <Field label="Password" icon={FiLock}
                    type={showLP ? 'text' : 'password'}
                    value={ld.password} placeholder="Enter your password"
                    onChange={e => setLd({ ...ld, password: e.target.value })}
                    right={
                      <button type="button" onClick={() => setShowLP(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-gray-400 hover:text-primary transition-colors">
                        {showLP ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    } />

                  <button type="button"
                    className="text-[11px] text-primary text-right
                               hover:opacity-80 transition-opacity -mt-1">
                    Forgot password?
                  </button>

                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-primary text-white rounded-xl
                               text-[13px] font-medium hover:opacity-90
                               transition-opacity flex items-center justify-center
                               gap-2 disabled:opacity-60">
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <> Sign in to ShopSphere <FiArrowRight size={14} /> </>}
                  </button>

                  <Divider text="or continue with" />
                  <GoogleBtn label="Continue with Google" />
                </form>
              </div>

              {/* ── Register form ── */}
              <div className="w-1/2 px-6 pb-6">
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                  <Field label="Full name" icon={FiUser} type="text"
                    value={rd.name} placeholder="John Doe"
                    onChange={e => setRd({ ...rd, name: e.target.value })} />

                  <Field label="Email address" icon={FiMail} type="email"
                    value={rd.email} placeholder="you@email.com"
                    onChange={e => setRd({ ...rd, email: e.target.value })} />

                  {/* Password + strength */}
                  <div>
                    <label className="text-[11px] font-medium text-gray-500
                                      dark:text-gray-400 mb-1.5 block">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2
                                         text-gray-400" size={14} />
                      <input type={showRP ? 'text' : 'password'}
                        value={rd.password} placeholder="Min. 6 characters"
                        onChange={e => {
                          setRd({ ...rd, password: e.target.value });
                          setStrength(checkStrength(e.target.value));
                        }}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-[13px]
                                   bg-gray-50 dark:bg-[#14142A]
                                   border border-gray-200 dark:border-white/[0.08]
                                   text-gray-800 dark:text-gray-200
                                   placeholder-gray-400 outline-none
                                   focus:border-primary transition-colors" />
                      <button type="button" onClick={() => setShowRP(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-gray-400 hover:text-primary transition-colors">
                        {showRP ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                    {rd.password && (
                      <div className="mt-2">
                        <div className="h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-300"
                            style={{ width: strength.width, background: strength.color }} />
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: strength.color }}>
                          {strength.text} password
                        </p>
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-primary text-white rounded-xl
                               text-[13px] font-medium hover:opacity-90
                               transition-opacity flex items-center justify-center
                               gap-2 disabled:opacity-60">
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <> Create my account <FiArrowRight size={14} /></>}
                  </button>

                  <Divider text="or sign up with" />
                  <GoogleBtn label="Continue with Google" />

                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    By registering you agree to our{' '}
                    <span className="text-primary cursor-pointer">Terms</span> &amp;{' '}
                    <span className="text-primary cursor-pointer">Privacy Policy</span>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}