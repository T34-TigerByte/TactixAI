import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Logo from '../../components/ui/Logo';
import { ROUTES } from '../../router/routes';
import { setPasswordRequest } from '../../api/auth.api';

const BG_STYLE: React.CSSProperties = {
  backgroundImage: "url('/dark-blue_texture_triangle_bg.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
};

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isStrong = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !isStrong || !token) return;
    setError(null);
    setIsLoading(true);
    try {
      await setPasswordRequest(token, password);
      setDone(true);
    } catch {
      setError('This link may have expired or already been used. Please contact your administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className='min-h-screen flex flex-col items-center justify-center'
        style={BG_STYLE}
      >
        <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto' />
          <h2 className='text-lg font-bold text-gray-900'>Invalid Link</h2>
          <p className='text-sm text-gray-500'>This link is missing a token. Please use the link from your email.</p>
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className='w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors cursor-pointer'
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col' style={BG_STYLE}>
      <header className='px-8 py-5 flex items-center gap-3'>
        <Logo />
      </header>

      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
            {done ? (
              <div className='flex flex-col items-center text-center gap-4 py-4'>
                <CheckCircle className='w-14 h-14 text-green-500' />
                <div className='space-y-1'>
                  <h2 className='text-xl font-bold text-gray-900'>Account Ready!</h2>
                  <p className='text-sm text-gray-500'>
                    Your password has been set. You can now sign in to TactixAI.
                  </p>
                </div>
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className='mt-2 px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors cursor-pointer'
                >
                  Sign In
                </button>
              </div>
            ) : (
              <>
                <div className='space-y-1'>
                  <h2 className='text-2xl font-bold text-gray-900'>Set Your Password</h2>
                  <p className='text-sm text-gray-500'>
                    Create a password to complete your TactixAI account setup.
                  </p>
                </div>

                {error && (
                  <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
                    <p className='text-red-600 text-sm text-center'>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-1.5'>
                    <label className='text-gray-700 text-sm font-medium'>Password</label>
                    <div className='relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Min. 8 characters'
                        required
                        className='w-full px-4 py-3 pr-11 rounded-lg border border-gray-200 text-gray-900 text-sm
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword((v) => !v)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer'
                      >
                        {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                      </button>
                    </div>
                    {password && !isStrong && (
                      <p className='text-xs text-red-500'>Password must be at least 8 characters.</p>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-gray-700 text-sm font-medium'>Confirm Password</label>
                    <div className='relative'>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='Re-enter your password'
                        required
                        className='w-full px-4 py-3 pr-11 rounded-lg border border-gray-200 text-gray-900 text-sm
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition'
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirm((v) => !v)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer'
                      >
                        {showConfirm ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                      </button>
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <p className='text-xs text-red-500'>Passwords do not match.</p>
                    )}
                  </div>

                  <button
                    type='submit'
                    disabled={isLoading || !isStrong || !passwordsMatch || !confirmPassword}
                    className='w-full py-3 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-500
                               active:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
                  >
                    {isLoading ? 'Setting password...' : 'Complete Setup'}
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
