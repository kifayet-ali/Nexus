import React, { useState } from 'react';
import {
  Shield, Lock, Smartphone, Eye, EyeOff,
  CheckCircle, XCircle, AlertTriangle, User, Users
} from 'lucide-react';

const SecurityPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [activeRole, setActiveRole] = useState<'entrepreneur' | 'investor'>('entrepreneur');

  // Password Strength
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (pass.length >= 12) score++;
    return score;
  };

  const strength = getStrength(password);

  const getStrengthLabel = () => {
    if (strength === 0) return { label: '', color: '' };
    if (strength <= 1) return { label: 'Very Weak', color: 'text-red-500' };
    if (strength === 2) return { label: 'Weak', color: 'text-orange-500' };
    if (strength === 3) return { label: 'Fair', color: 'text-yellow-500' };
    if (strength === 4) return { label: 'Strong', color: 'text-blue-500' };
    return { label: 'Very Strong', color: 'text-green-500' };
  };

  const getBarColor = (index: number) => {
    if (strength === 0) return 'bg-gray-200';
    if (strength <= 1) return index < 1 ? 'bg-red-500' : 'bg-gray-200';
    if (strength === 2) return index < 2 ? 'bg-orange-500' : 'bg-gray-200';
    if (strength === 3) return index < 3 ? 'bg-yellow-500' : 'bg-gray-200';
    if (strength === 4) return index < 4 ? 'bg-blue-500' : 'bg-gray-200';
    return 'bg-green-500';
  };

  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number included', pass: /[0-9]/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
    { label: '12+ characters', pass: password.length >= 12 },
  ];

  // OTP Handler
  const handleOtp = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setOtpVerified(true);
    }
  };

  // Role Features
  const roleFeatures = {
    entrepreneur: [
      ' Access to pitch deck tools',
      ' Meeting scheduling with investors',
      ' Document chamber for deals',
      ' Direct messaging with investors',
      ' Startup analytics dashboard',
      ' Deal flow management',
    ],
    investor: [
      ' Browse startup portfolios',
      ' Investment deal management',
      ' Portfolio analytics',
      ' Meeting scheduling with entrepreneurs',
      ' Payment & funding tools',
      ' Due diligence documents',
    ],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
         Security & Access Control
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column */}
        <div className="flex flex-col gap-6">

          {/* Password Strength Meter */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={20} className="text-primary-600" />
              <h2 className="font-semibold text-gray-700">Password Strength Meter</h2>
            </div>

            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary-400"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength Bars */}
            {password && (
              <>
                <div className="flex gap-1 mb-2">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${getBarColor(i)}`}
                    />
                  ))}
                </div>
                <p className={`text-sm font-medium mb-3 ${getStrengthLabel().color}`}>
                  {getStrengthLabel().label}
                </p>
              </>
            )}

            {/* Checklist */}
            <div className="flex flex-col gap-2">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2">
                  {check.pass
                    ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    : <XCircle size={14} className="text-gray-300 flex-shrink-0" />
                  }
                  <span className={`text-xs ${check.pass ? 'text-green-600' : 'text-gray-400'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2FA OTP Mockup */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={20} className="text-primary-600" />
              <h2 className="font-semibold text-gray-700">Two-Factor Authentication</h2>
            </div>

            {!otpStep && !otpVerified && (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={28} className="text-primary-600" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Enable 2FA for extra security. We'll send a 6-digit OTP to your phone.
                </p>
                <button
                  onClick={() => setOtpStep(true)}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-primary-700 transition-all"
                >
                  Enable 2FA — Send OTP
                </button>
              </div>
            )}

            {otpStep && !otpVerified && (
              <div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-blue-500" />
                  <p className="text-xs text-blue-600">
                    OTP sent to +92 XXX XXXXXXX
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Enter 6-digit OTP
                </p>
                <div className="flex gap-2 justify-center mb-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtp(i, e.target.value)}
                      className="w-10 h-12 border-2 border-gray-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:border-primary-400 transition-all"
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-green-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
                >
                   Verify OTP
                </button>
                <button
                  onClick={() => { setOtpStep(false); setOtp(['', '', '', '', '', '']); }}
                  className="w-full mt-2 bg-gray-100 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}

            {otpVerified && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <p className="text-green-600 font-semibold mb-1">2FA Enabled!</p>
                <p className="text-xs text-gray-400">Your account is now protected</p>
                <button
                  onClick={() => { setOtpVerified(false); setOtpStep(false); setOtp(['', '', '', '', '', '']); }}
                  className="mt-4 w-full bg-gray-100 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">

          {/* Role Based UI */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-primary-600" />
              <h2 className="font-semibold text-gray-700">Role-Based Access Control</h2>
            </div>

            {/* Role Toggle */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
              <button
                onClick={() => setActiveRole('entrepreneur')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeRole === 'entrepreneur'
                    ? 'bg-white text-primary-600 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User size={15} /> Entrepreneur
              </button>
              <button
                onClick={() => setActiveRole('investor')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeRole === 'investor'
                    ? 'bg-white text-primary-600 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={15} /> Investor
              </button>
            </div>

            {/* Role Badge */}
            <div className={`rounded-xl p-4 mb-4 ${
              activeRole === 'entrepreneur'
                ? 'bg-primary-50 border border-primary-100'
                : 'bg-secondary-50 border border-secondary-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeRole === 'entrepreneur' ? 'bg-primary-100' : 'bg-secondary-100'
                }`}>
                  {activeRole === 'entrepreneur'
                    ? <User size={18} className="text-primary-600" />
                    : <Users size={18} className="text-secondary-600" />
                  }
                </div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">{activeRole}</p>
                  <p className="text-xs text-gray-500">
                    {activeRole === 'entrepreneur'
                      ? 'Build & pitch your startup'
                      : 'Discover & fund startups'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Accessible Features
              </p>
              {roleFeatures[activeRole].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary-600" />
              <h2 className="font-semibold text-gray-700">Security Tips</h2>
            </div>
            {[
              { icon: '', tip: 'Use a unique password for each account' },
              { icon: '', tip: 'Always enable 2FA on sensitive accounts' },
              { icon: '', tip: 'Never share your OTP with anyone' },
              { icon: '', tip: 'Change your password every 90 days' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                <span className="text-lg">{item.icon}</span>
                <p className="text-sm text-gray-600">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;