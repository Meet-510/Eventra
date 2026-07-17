import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import AuthCard, { FieldLabel, SubmitButton } from '../components/AuthCard';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Forgot Password"
            subtitle="Enter your email and we'll send you a link to reset your password"
            error={error}
            success={message}
            footer={
                <>Remembered your password? <Link to="/login" className="font-bold text-white hover:text-iris-300 transition-colors">Sign in</Link></>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <SubmitButton loading={loading}>Send Reset Link</SubmitButton>
            </form>
        </AuthCard>
    );
};

export default ForgotPassword;
