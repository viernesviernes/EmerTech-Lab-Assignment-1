const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'token';
const SECRET = process.env.SESSION_SECRET || process.env.sessionSecret;
const MAX_AGE_SEC = 1 * 60 * 60;

function sign(payload) {
  if (!SECRET) throw new Error('SESSION_SECRET or sessionSecret required');
  return jwt.sign(payload, SECRET, { expiresIn: MAX_AGE_SEC });
}

function verify(token) {
  if (!SECRET || !token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function getTokenFromReq(req) {
  return req?.cookies?.[COOKIE_NAME] ?? null;
}

function setTokenCookie(res, payload) {
  const token = sign(payload);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_SEC * 1000,
  });
}

function requireAdmin(context) {
  if (!context?.user || context.user.role !== 'admin') {
    throw new Error('Unauthorized: admin required');
  }
}

function requireStudent(context) {
  if (!context?.user || context.user.role !== 'student') {
    throw new Error('Unauthorized: student required');
  }
}

module.exports = {
  COOKIE_NAME,
  sign,
  verify,
  getTokenFromReq,
  setTokenCookie,
  requireAdmin,
  requireStudent,
};
