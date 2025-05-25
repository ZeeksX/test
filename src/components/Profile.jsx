import { useState, useRef } from 'react';
import { FiUpload } from "react-icons/fi";
import { useAuth } from './Auth';
import { profileImageDefault } from "../utils/images";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef(null);

    // State management
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [matricNumber, setMatricNumber] = useState(user?.matric_number || '');
    const [profileImage, setProfileImage] = useState(user?.profileImage || profileImageDefault);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Image upload handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError('Only JPG/PNG files are supported');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImage(e.target.result);
            // Here you would typically upload to your server
        };
        reader.readAsDataURL(file);
    };

    // Save profile changes
    const handleSave = async () => {
        setIsSaving(true);
        setError('');

        try {
            const updatedData = {
                firstName,
                lastName,
                email,
                ...(user.role === 'teacher' ? { phone } : { matricNumber }),
                profileImage: profileImage !== profileImageDefault ? profileImage : undefined
            };

            // Simulated API call
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Failed to save changes');

            // Update auth context
            updateUser({ ...user, ...updatedData });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Password change handler
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.access_token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (!response.ok) throw new Error('Password change failed');

            setShowChangePassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Google disconnect handler
    const handleGoogleDisconnect = async () => {
        try {
            await fetch('/api/disconnect-google', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            updateUser({ ...user, provider: 'email' });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="inter flex flex-col items-center mb-8">
            <div className="w-[756px] max-md:w-[90%]">
                {/* Error Message */}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Header */}
                <div className="mt-8 flex flex-col gap-4">
                    <h1 className='text-[32px] leading-8 font-medium'>Edit profile</h1>
                    <p className="text-[#A1A1A1] text-sm font-normal">Manage your profile</p>
                </div>

                {/* Profile Image Section */}
                <div className='flex flex-row max-md:flex-col items-end max-md:items-center gap-12 mt-5'>
                    <img src={profileImage} alt="Profile" className="w-[150px] h-[150px] rounded-full" />
                    <div className="flex flex-col gap-6 max-md:items-center">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="cursor-pointer text-base font-semibold leading-6 w-[173px] h-[44px] rounded-md bg-[#1836B2] text-white flex gap-2 flex-row justify-center items-center"
                        >
                            Upload image
                            <FiUpload />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/jpeg, image/png"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <div className="flex flex-col gap-2 max-md:items-center">
                            <p className="text-[#A1A1A1] text-xs font-medium">
                                At least 800x800 px recommended
                            </p>
                            <p className="text-[#A1A1A1] text-xs font-medium">
                                Only JPG or PNG are supported
                            </p>
                        </div>
                    </div>
                </div>

                {/* Name Section */}
                <div className='flex flex-row gap-12 max-md:gap-6 p-5 h-[107px] max-md:h-auto rounded-[10px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)] mt-10'>
                    <div className="min-w-[100px] max-md:min-w-[50px]">
                        <h1 className="text-[#222222] text-base font-semibold">Name</h1>
                    </div>
                    <div className="flex flex-row gap-6 w-full max-md:flex-col">
                        <div className="flex flex-col gap-2 w-full">
                            <label className="inter font-medium text-sm">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full h-[44px] text-base font-normal leading-6 border rounded-md py-[10px] px-[14px]"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <label className="inter font-medium text-sm">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full h-[44px] text-base font-normal leading-6 border rounded-md py-[10px] px-[14px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Account Section */}
                <div className='flex flex-row gap-8 p-5 h-[107px] max-md:h-auto rounded-[10px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)] mt-5'>
                    <div className="min-w-[100px] max-md:min-w-[50px]">
                        <h1 className="text-[#222222] text-base font-semibold">Account</h1>
                    </div>
                    <div className="flex flex-row max-md:flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <label className="inter font-medium text-sm">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[44px] text-base font-normal leading-6 border rounded-md py-[10px] px-[14px]"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <label className="inter font-medium text-sm">
                                {user?.role === "teacher" ? "Phone number" : "Matric Number"}
                            </label>
                            <input
                                type="text"
                                value={user?.role === "teacher" ? phone : matricNumber}
                                onChange={(e) => user?.role === "teacher"
                                    ? setPhone(e.target.value)
                                    : setMatricNumber(e.target.value)
                                }
                                className="w-full h-[44px] text-base font-normal leading-6 border rounded-md py-[10px] px-[14px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className='flex flex-row gap-8 p-5 rounded-[10px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)] mt-5'>
                    <div className="min-w-[100px]">
                        <h1 className="text-[#222222] text-base font-semibold">Security</h1>
                    </div>
                    <div className="flex flex-col gap-6 w-full">
                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="cursor-pointer text-base font-semibold leading-6 w-[173px] h-[44px] rounded-md bg-[#1836B2] text-white flex gap-2 flex-row justify-center items-center"
                        >
                            Change Password
                        </button>
                    </div>
                </div>


                {/* Connected Accounts */}
                <div className='flex flex-row gap-3 p-5 h-[90px] max-md:h-auto rounded-[10px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)] mt-5'>
                    <div className="min-w-[100px]">
                        <h1 className="text-[#222222] text-base font-semibold">Connected Accounts</h1>
                    </div>
                    <div className="flex flex-row max-md:flex-col gap-8 items-center max-md:items-end w-full">
                        <div className="flex flex-col gap-2">
                            <p className="inter font-medium text-sm">Google Account</p>
                            <p className="text-[#A1A1A1] text-sm font-normal">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleGoogleDisconnect}
                            className="cursor-pointer text-base font-semibold leading-6 w-[124px] h-[44px] rounded-md bg-[#EA4335] text-white flex gap-2 flex-row justify-center items-center"
                        >
                            Disconnect
                        </button>
                    </div>
                </div>


                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="cursor-pointer text-base font-semibold leading-6 w-[173px] h-[44px] rounded-md bg-[#1836B2] text-white flex justify-center items-center disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Change Password Modal */}
                {showChangePassword && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setShowChangePassword(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePasswordChange}
                                        className="px-4 py-2 bg-[#1836B2] text-white rounded hover:bg-[#142a8b]"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;