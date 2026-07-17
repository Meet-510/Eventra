import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard, { FieldLabel, SubmitButton } from '../components/AuthCard';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Welcome Back"
            subtitle="Sign in to your Eventra account"
            error={error}
            footer={
                <>Don't have an account? <Link to="/register" className="font-bold text-white hover:text-iris-300 transition-colors">Sign up</Link></>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div>
                            <FieldLabel>Email Address</FieldLabel>
                            <input
                                type="email"
                                required
                                className="field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <FieldLabel>Password</FieldLabel>
                            <input
                                type="password"
                                required
                                className="field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="mt-2.5 text-right">
                                <Link to="/forgot-password" className="text-sm font-semibold text-zinc-500 hover:text-iris-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <FieldLabel>Verification Code (OTP)</FieldLabel>
                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="field text-center text-lg font-bold tracking-[0.4em]"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}
                <SubmitButton loading={loading}>
                    {showOTP ? 'Verify OTP & Log In' : 'Sign In'}
                </SubmitButton>
            </form>
        </AuthCard>
    );
};

export default Login;
