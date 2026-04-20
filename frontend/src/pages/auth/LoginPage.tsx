import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../router/routes";
import Logo from "../../components/ui/Logo";
import { BookOpen, Users, BarChart2 } from "lucide-react";


const ROLE_REDIRECT: Record<string, string> = {
  admin:    ROUTES.ADMIN.DASHBOARD,
  learner:  ROUTES.LEARNER.DASHBOARD,
}

const FEATURES = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    color: 'text-cyan-400',
    title: 'Interactive Scenario-Based Learning',
    desc: 'Practice realistic ransomware negotiations with AI-powered threat actors. Document breach methods, encrypted data, and exploitation strategies.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    color: 'text-orange-500',
    title: 'Role-Based Training',
    desc: 'Tailored experiences for learners and administrators with comprehensive performance tracking and detailed analytics.',
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    color: 'text-orange-500',
    title: 'Comprehensive Performance Metrics',
    desc: 'Track negotiation time extensions, ransom reductions, decryption proof requests, and data exploitation discussions.',
  },
]

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDemoAccts, setShowDemoAccts] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();
    
    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const { role } = await login({ email, password });
            navigate(ROLE_REDIRECT[role] ?? ROUTES.LOGIN, { replace: true });
        } catch(error) {
            console.error('Login error:', error);
            setError('Login failed');
        } finally {
            setIsLoading(false);
        }
    
    }

    const fillDemo = (demoEmail: string, role: string) => {
        setEmail(demoEmail)
        if (role === 'Learner') {
          setPassword('new-user-1234');
        } else {
          setPassword('admin1234')
        }
        setShowDemoAccts(false)
    }
        
    return (
      <div className='min-h-screen bg-slate-900 flex flex-col'>
        {/* Navigation */}
        <header className='px-8 py-5 flex items-center gap-3'>
          {/* FlameTree Logo */}
          <Logo />
        </header>

        {/* Main Contents */}
        <main className='flex-1 flex items-center'>
          <div
            className='w-full max-w-7xl mx-auto px-8 py-12
                        flex flex-col lg:flex-row items-center gap-16'
          >
            {/* Left: Title & Feature Cards */}
            <div className='flex-1 space-y-8'>
              <div className='space-y-3'>
                <h1 className='text-4xl font-bold text-white leading-tight'>
                  TactixAI.
                  <br />
                  Ransomware Negotiation Training Platform
                </h1>
                <p className='text-slate-400 text-lg'>
                  Practice Real-World Ransomware Negotiations in a Safe
                  Environment
                </p>
              </div>

              <div className='space-y-4'>
                {FEATURES.map(({ icon, color, title, desc }) => (
                  <div
                    key={title}
                    className='flex items-start gap-4 p-5 rounded-xl
                             bg-slate-800/60 border border-slate-700/50
                             hover:border-slate-600 transition-colors'
                  >
                    <div className={`shrink-0 mt-0.5 ${color}`}>{icon}</div>
                    <div>
                      <h3 className='text-white font-semibold mb-1'>{title}</h3>
                      <p className='text-slate-400 text-sm leading-relaxed'>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Login Card */}
            <div className='w-full lg:w-105 shrink-0'>
              <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
                {/* Card Header */}
                <div className='text-center space-y-1'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Sign In to Your Account
                  </h2>
                  <p className='text-gray-500 text-sm'>
                    Access your training dashboard
                  </p>
                </div>

                {/* Error View */}
                {error && (
                  <div className='p-3 rounded-lg bg-orange-50 border border-red-200'>
                    <p className='text-red-600 text-sm text-center'>{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-1.5'>
                    <label className='text-gray-700 text-sm font-medium'>
                      Email
                    </label>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Enter your email'
                      required
                      className='w-full px-4 py-3 rounded-lg border border-gray-200
                               text-gray-900 text-sm placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-orange-600
                               focus:border-transparent transition'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-gray-700 text-sm font-medium'>
                      Password
                    </label>
                    <input
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='Enter your password'
                      required
                      className='w-full px-4 py-3 rounded-lg border border-gray-200
                               text-gray-900 text-sm placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-orange-600
                               focus:border-transparent transition'
                    />
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full py-3 rounded-lg font-semibold text-white
                             bg-orange-600 hover:bg-orange-500 active:bg-orange-800
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors
                             cursor-pointer'
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                {/* Line Separator */}
                <div className='flex items-center gap-3'>
                  <div className='flex-1 h-px bg-gray-200' />
                  <span className='text-gray-400 text-xs'>Demo Access</span>
                  <div className='flex-1 h-px bg-gray-200' />
                </div>

                {/* Demo Accounts Selection */}
                <div className='space-y-3'>
                  <button
                    type='button'
                    onClick={() => setShowDemoAccts((v) => !v)}
                    className='w-full py-3 rounded-lg font-semibold text-sm
                             text-orange-600 border border-red-300
                             hover:bg-orange-50 transition-colors
                             cursor-pointer'
                  >
                    {showDemoAccts
                      ? 'Hide Demo Accounts'
                      : 'Show Demo Accounts'}
                  </button>

                  {showDemoAccts && (
                    <div className='space-y-2'>
                      {[
                        { email: 'admin@dev.local', role: 'Admin' },
                        { email: 'test3@dev.local', role: 'Learner' },
                      ].map(({ email, role }) => (
                        <button
                          key={role}
                          type='button'
                          onClick={() => fillDemo(email, role)}
                          className='w-full flex items-center justify-between
                                   px-4 py-2.5 rounded-lg text-sm
                                   bg-gray-50 hover:bg-gray-100
                                   border border-gray-200 transition-colors
                                   cursor-pointer'
                        >
                          <span className='text-gray-600'>{email}</span>
                          <span
                            className='text-xs text-red-500 font-medium
                                         bg-orange-50 px-2 py-0.5 rounded-full'
                          >
                            {role}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <p className='text-center text-gray-500 text-sm'>
                  Don't have an account?{' '}
                  <span
                    className='text-red-600 font-medium cursor-pointer
                                 hover:underline'
                  >
                    Contact your administrator
                  </span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
};

export default LoginPage;