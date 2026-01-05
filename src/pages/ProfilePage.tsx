import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  FileText,
  Camera,
  Save,
  X,
  Check,
  Loader2,
  ArrowLeft,
  Shield,
  Sparkles,
  Trash2,
  Pencil,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Available languages
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ur', name: 'Urdu' },
];

// Helper to get language name from code
const getLanguageName = (code: string) => {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? lang.name : code;
};

// Helper to format date for display
const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, uploadAvatar, deleteAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    language: '',
    bio: '',
    address: '',
  });

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        language: user.language || '',
        bio: user.bio || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validate username is required
    if (!formData.username || formData.username.length < 2) {
      setErrorMessage('Username is required (minimum 2 characters)');
      setIsSaving(false);
      return;
    }

    // Validate phone number format (optional but must be valid if provided)
    if (formData.phoneNumber) {
      if (formData.phoneNumber.length > 20) {
        setErrorMessage('Phone number is too long (max 20 characters)');
        setIsSaving(false);
        return;
      }
      // Phone must start with + and contain only digits after that
      if (!/^\+?\d+$/.test(formData.phoneNumber)) {
        setErrorMessage('Phone number must contain only digits (e.g., +923001234567)');
        setIsSaving(false);
        return;
      }
    }

    // Validate dateOfBirth must be in past
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      if (dob >= new Date()) {
        setErrorMessage('Date of birth must be in the past');
        setIsSaving(false);
        return;
      }
    }

    try {
      // Update profile - backend requires all fields including username and email
      await updateProfile({
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        language: formData.language || undefined,
        bio: formData.bio || undefined,
        address: formData.address || undefined,
      });

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      // Show backend error message if available
      const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
      if (backendMessage) {
        setErrorMessage(`Update failed: ${backendMessage}`);
      } else {
        setErrorMessage('Failed to update profile. Please check your input and try again.');
      }
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    setErrorMessage('');

    try {
      await uploadAvatar(file);
      setSuccessMessage('Avatar updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to upload avatar. Please try again.');
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle avatar delete
  const handleDeleteAvatar = async () => {
    setIsUploadingAvatar(true);
    setErrorMessage('');

    try {
      await deleteAvatar();
      setSuccessMessage('Avatar removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to remove avatar. Please try again.');
      console.error('Avatar delete error:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        language: user.language || '',
        bio: user.bio || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
    setErrorMessage('');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Display field component - shows value or "Not set"
  const DisplayField = ({
    icon: Icon,
    label,
    value,
    subtext,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
    subtext?: string;
  }) => (
    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-dark-elevated/50 rounded-lg sm:rounded-xl border border-dark-border/50">
      <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-lg flex-shrink-0">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-text-muted mb-0.5 sm:mb-1">{label}</p>
        {value ? (
          <p className="text-text-primary font-medium text-sm sm:text-base break-words">{value}</p>
        ) : (
          <p className="text-text-muted/50 italic text-sm sm:text-base">Not set</p>
        )}
        {subtext && <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 sm:mt-1">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 sm:gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back</span>
        </button>

        {/* Page Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-400 flex-shrink-0" />
            My Profile
          </h1>
          <p className="text-text-secondary mt-1.5 sm:mt-2 text-sm sm:text-base">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 sm:gap-3 text-emerald-400 text-sm sm:text-base">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="break-words">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 sm:gap-3 text-red-400 text-sm sm:text-base">
            <X className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="break-words">{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card border border-dark-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Profile Photo</h2>

              {/* Avatar Preview */}
              <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-3 sm:mb-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="w-full h-full rounded-xl sm:rounded-2xl object-cover border-3 sm:border-4 border-dark-border"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center border-3 sm:border-4 border-dark-border">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}

                {/* Upload Button Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 p-2 sm:p-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg sm:rounded-xl text-white transition-colors shadow-lg disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Delete Avatar Button */}
              {user.avatarUrl && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={isUploadingAvatar}
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg sm:rounded-xl transition-colors border border-red-500/20 text-sm sm:text-base"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Remove Photo
                </button>
              )}

              <p className="text-[10px] sm:text-xs text-text-muted text-center mt-3 sm:mt-4">
                JPG, PNG or GIF. Max 5MB.
              </p>

              {/* Role Badge */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-dark-elevated rounded-lg sm:rounded-xl border border-dark-border">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-text-muted">Account Type</p>
                    <p className="font-semibold text-text-primary text-sm sm:text-base">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-dark-card border border-dark-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-text-primary">Personal Information</h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* View Mode - Display Fields */}
              {!isEditing ? (
                <div className="space-y-4">
                  <DisplayField
                    icon={User}
                    label="Username"
                    value={user.username}
                  />
                  <DisplayField
                    icon={Mail}
                    label="Email"
                    value={user.email}
                    subtext="Email cannot be changed"
                  />
                  <DisplayField
                    icon={Phone}
                    label="Phone Number"
                    value={user.phoneNumber}
                  />
                  <DisplayField
                    icon={Calendar}
                    label="Date of Birth"
                    value={formatDateDisplay(user.dateOfBirth || '')}
                  />
                  <DisplayField
                    icon={Globe}
                    label="Preferred Language"
                    value={user.language ? getLanguageName(user.language) : null}
                  />
                  <DisplayField
                    icon={MapPin}
                    label="Address"
                    value={user.address}
                  />
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-dark-elevated/50 rounded-lg sm:rounded-xl border border-dark-border/50">
                    <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-lg flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-text-muted mb-0.5 sm:mb-1">About Me</p>
                      {user.bio ? (
                        <p className="text-text-primary text-sm sm:text-base whitespace-pre-wrap break-words">{user.bio}</p>
                      ) : (
                        <p className="text-text-muted/50 italic text-sm sm:text-base">Not set</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode - Form Fields */
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 sm:space-y-5">
                    {/* Username */}
                    <div>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Username</span>
                        <span className="text-[10px] sm:text-xs text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-sm sm:text-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        placeholder="Your username"
                        minLength={2}
                        maxLength={50}
                        required
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Email</span>
                        <span className="text-[10px] sm:text-xs text-text-muted">(cannot be changed)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-sm sm:text-base text-text-primary placeholder-text-muted opacity-60 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        maxLength={20}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-sm sm:text-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        placeholder="+92 300 1234567"
                      />
                      <p className="text-[10px] sm:text-xs text-text-muted mt-1">
                        Format: +[country code] [number] (max 20 characters)
                      </p>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Date of Birth</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-sm sm:text-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    {/* Language */}
                    <div>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Preferred Language</span>
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-sm sm:text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="">Select a language</option>
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Address</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-sm sm:text-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        placeholder="123 Main Street, City, Country"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-secondary mb-1.5 sm:mb-2">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>About Me</span>
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        maxLength={500}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-sm sm:text-base text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                        placeholder="Tell us about yourself, your travel interests..."
                      />
                      <p className="text-[10px] sm:text-xs text-text-muted mt-1">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-dark-border">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 sm:px-5 py-2.5 text-sm sm:text-base text-text-secondary hover:text-text-primary hover:bg-dark-elevated rounded-lg sm:rounded-xl transition-colors text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
