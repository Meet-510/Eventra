import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import AuthCard, { FieldLabel, SubmitButton } from '../components/AuthCard';

const ResetPassword = () => {
    const { id, token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post(`/auth/reset-password/${id}/${token}`, { password });
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard
            title="Set New Password"
            subtitle="Choose a new password for your Eventra account"
            error={error}
            success={message ? `${message} Redirecting to login...` : ''}
            footer={
                <>Back to <Link to="/login" className="font-bold text-white hover:text-iris-300 transition-colors">Sign in</Link></>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <FieldLabel>New Password</FieldLabel>
                    <input
                        type="password"
                        required
                        minLength={6}
                        className="field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <FieldLabel>Confirm New Password</FieldLabel>
                    <input
                        type="password"
                        required
                        minLength={6}
                        className="field"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <SubmitButton loading={loading || !!message}>Reset Password</SubmitButton>
            </form>
        </AuthCard>
    );
};

export default ResetPassword;
