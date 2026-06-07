const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Quiz = require('../models/quizModel');
const Attempt = require('../models/attemptModel');

const VALID_AVATAR_IDS = ['avatar_1', 'avatar_2', 'avatar_3', 'avatar_4', 'avatar_5', 'avatar_6'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB original file size

// GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalCreated, totalTaken] = await Promise.all([
      Quiz.countDocuments({ createdBy: userId }),
      Attempt.countDocuments({ userId }),
    ]);

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarType: req.user.avatarType ?? 'default',
      avatarUrl: req.user.avatarUrl ?? 'avatar_1',
      createdAt: req.user.createdAt,
      totalCreated,
      totalTaken,
    });
  } catch (error) {
    console.error('getProfile error:', error.name, error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  const { name } = req.body;
  const trimmed = (name ?? '').trim();

  if (!trimmed) {
    return res.status(400).json({ message: 'Name is required' });
  }
  if (trimmed.length < 2 || trimmed.length > 50) {
    return res.status(400).json({ message: 'Name must be 2–50 characters' });
  }

  try {
    req.user.name = trimmed;
    await req.user.save();
    res.json({ name: req.user.name });
  } catch (error) {
    console.error('updateProfile error:', error.name, error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/profile/avatar/upload
// Accepts { avatarData: "data:image/jpeg;base64,..." } as JSON
exports.uploadAvatar = async (req, res) => {
  const { avatarData } = req.body;

  if (!avatarData || typeof avatarData !== 'string') {
    return res.status(400).json({ message: 'Image data is required' });
  }

  // Parse "data:<mime>;base64,<payload>"
  const match = avatarData.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
  if (!match) {
    return res.status(400).json({ message: 'Invalid image format' });
  }

  const [, mimeType, payload] = match;
  if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    return res.status(400).json({ message: 'File must be JPEG, PNG, or WEBP' });
  }

  // base64 payload is ~4/3 of the original binary size
  const approxBytes = Math.ceil(payload.length * 0.75);
  if (approxBytes > MAX_AVATAR_BYTES) {
    return res.status(400).json({ message: 'Image must be under 2 MB' });
  }

  try {
    req.user.avatarType = 'uploaded';
    req.user.avatarUrl = avatarData;
    await req.user.save();
    res.json({ avatarType: 'uploaded', avatarUrl: avatarData });
  } catch (error) {
    console.error('uploadAvatar error:', error.name, error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile/avatar/default
exports.selectDefaultAvatar = async (req, res) => {
  const { avatarId } = req.body;

  if (!avatarId || !VALID_AVATAR_IDS.includes(avatarId)) {
    return res.status(400).json({ message: 'Invalid avatar selection' });
  }

  try {
    req.user.avatarType = 'default';
    req.user.avatarUrl = avatarId;
    await req.user.save();
    res.json({ avatarType: 'default', avatarUrl: avatarId });
  } catch (error) {
    console.error('selectDefaultAvatar error:', error.name, error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile/password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All password fields are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Fetch user with password — protect middleware excludes it
    const userWithPw = await User.findById(req.user._id);
    const isMatch = await userWithPw.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password must differ from current password' });
    }

    userWithPw.password = newPassword;
    await userWithPw.save(); // pre-save hook hashes automatically
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('changePassword error:', error.name, error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
