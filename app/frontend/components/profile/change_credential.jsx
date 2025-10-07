import React, { useState } from 'react';

export default function ChangeCredential({ type, onSubmit }) {
    const [value, setValue] = useState('');
    const [confirmValue, setConfirmValue] = useState('');
    const [error, setError] = useState('');

    const label = type === 'email' ? 'Email' : 'Password';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (value !== confirmValue) {
            setError(`${label}s do not match.`);
            return;
        }
        if (onSubmit) {
            onSubmit(value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
            <h2 className=' text-3xl font-semibold mb-6'>Change {label}</h2>
            <div style={{ marginBottom: 16 }}>
                <label>
                    New {label}:
                    <input
                        type={type === 'email' ? 'email' : 'password'}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        required
                        className='input'
                    />
                </label>
            </div>
            <div style={{ marginBottom: 16 }}>
                <label>
                    Confirm New {label}:
                    <input
                        type={type === 'email' ? 'email' : 'password'}
                        value={confirmValue}
                        onChange={e => setConfirmValue(e.target.value)}
                        required
                        className='input'
                    />
                </label>
            </div>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            <button type="submit">Confirm Change</button>
        </form>
    );
}