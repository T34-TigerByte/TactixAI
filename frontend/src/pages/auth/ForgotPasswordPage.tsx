import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MailCheck } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import { ROUTES } from '../../router/routes';
import { forgotPasswordRequest } from '../../api/auth.api';

const BG_STYLE: React.CSSProperties = {
  backgroundImage: "url('/dark-blue_texture_triangle_bg.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPasswordRequest(email);
    } finally {
      // Always show success — BE returns 204 regardless of whether email exists
      setSubmitted(true);
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col' style={BG_STYLE}>
      <header className='px-8 py-5 flex items-center gap-3'>
        <Logo />
      </header>

      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md'>
          <Link
            to={ROUTES.LOGIN}
            className='flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Sign In
          </Link>

          <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
            {submitted ? (
              <div className='flex flex-col items-center text-center gap-4 py-4'>
                <MailCheck className='w-14 h-14 text-green-500' />
                <div className='space-y-1'>
                  <h2 className='text-xl font-bold text-gray-900'>Check your email</h2>
                  <p className='text-sm text-gray-500'>
                    If an account exists for <span className='font-medium text-gray-700'>{email}</span>, you'll receive a password reset link shortly.
                  </p>
                </div>
                <Link
                  to={ROUTES.LOGIN}
                  className='mt-2 px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors'
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                <div className='space-y-1'>
                  <h2 className='text-2xl font-bold text-gray-900'>Forgot password?</h2>
                  <p className='text-sm text-gray-500'>
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-1.5'>
                    <label className='text-gray-700 text-sm font-medium'>Email Address</label>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Enter your email'
                      required
                      className='w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition'
                    />
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full py-3 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-500
                               active:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
