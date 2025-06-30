// backend/middleware/requireRole.js
const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Bu əməliyyat üçün icazə yoxdur." });
  }
  next();
};

export default requireRole;
