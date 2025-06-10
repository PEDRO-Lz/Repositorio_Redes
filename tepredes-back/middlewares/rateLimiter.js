import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutos
  max: 10,
  message: { message: 'Muitas tentativas. Tente novamente mais tarde.' },
  keyGenerator: (req) => req.body.email || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
})

export const cadastroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: { message: 'Limite de cadastros atingido. Tente mais tarde.' },
  keyGenerator: (req) => req.body.email || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
})

export const resetSenhaLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 4,
  message: { message: 'Limite diário de redefinição de senha atingido. Tente novamente amanhã.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const resetSenhaEmailLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 4,
  message: { message: 'Limite diário de redefinição de senha para este e-mail atingido. Tente novamente amanhã.' },
  keyGenerator: (req) => req.body.email,
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: { message: 'Limite de uploads atingido. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: { message: 'Limite de criação de posts atingido. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});