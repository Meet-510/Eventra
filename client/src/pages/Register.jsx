import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard, { FieldLabel, SubmitButton } from '../components/AuthCard';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Create an Account"
            subtitle="Join Eventra today"
            error={error}
            success={showOTP && !error ? 'An OTP has been sent to your email. Please verify your account.' : ''}
            footer={
                !showOTP && (
                    <>Already have an account? <Link to="/login" className="font-bold text-white hover:text-iris-300 transition-colors">Sign in</Link></>
                )
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {!showOTP ? (
                    <>
                        <div>
                            <FieldLabel>Full Name</FieldLabel>
                            <input
                                type="text"
                                required
                                className="field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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

                <div className="pt-2">
                    <SubmitButton loading={loading}>
                        {showOTP ? 'Verify & Complete' : 'Sign Up'}
                    </SubmitButton>
                </div>
            </form>
        </AuthCard>
    );
};

export default Register;
