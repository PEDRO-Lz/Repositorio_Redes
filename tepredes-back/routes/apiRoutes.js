import express from 'express';
import { registerUserController, loginUserController, listAllUsersController, listPendingUsersController, countActivePostsController, countActiveUsersController } from '../controllers/userController.js';
import { loginAdminController, createAdminController, approveOrRejectUserController } from '../controllers/adminController.js';
import { createPostController, approveOrRejectPostController, getAllPostsController, getActivePostsController, getActivePostsByDisciplinaController, getPendingPostsController } from '../controllers/postController.js';
import authAdmin from '../middlewares/authAdmin.js';
import auth from '../middlewares/auth.js';
import { loginLimiter, cadastroLimiter, resetSenhaLimiter, uploadLimiter, postLimiter, resetSenhaEmailLimiter } from '../middlewares/rateLimiter.js';
import { uploadFileController } from '../controllers/uploadController.js';
import path from 'path'
import { fileURLToPath } from 'url'
import { gerarLinkTemporarioController, baixarArquivoComTokenController } from '../controllers/arquivoController.js';
import authUserOrAdmin from '../middlewares/authUserOrAdmin.js';
import uploadPdfOnly from '../middlewares/upload.js';
import { verifyUserCodeController } from '../controllers/userController.js'
import { sendPasswordResetCodeController, resetPasswordController } from '../controllers/userController.js';
import { redefinirSenhaAdminController } from '../controllers/adminController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/cadastro', cadastroLimiter, registerUserController);
router.post('/login', loginLimiter, loginUserController);
router.post('/verificar-codigo', verifyUserCodeController)
router.post('/esqueci-senha', resetSenhaLimiter, resetSenhaEmailLimiter, sendPasswordResetCodeController);
router.post('/resetar-senha', resetPasswordController);

router.get('/posts/ativos', auth, getActivePostsController);
router.get('/posts/ativos/:disciplina', auth, getActivePostsByDisciplinaController);
router.post('/post', auth, postLimiter, uploadPdfOnly.single('arquivoPdf'), createPostController);
router.post('/upload', auth, uploadLimiter, uploadPdfOnly.single('arquivoPdf'), uploadFileController);
router.get('/contarUsuariosAtivos', authUserOrAdmin, countActiveUsersController);
router.get('/contarPostsAtivos', authUserOrAdmin, countActivePostsController);

router.post('/admin/login', loginLimiter, loginAdminController);
router.post('/admin/criar', authAdmin, createAdminController);
router.get('/admin/posts', authAdmin, getAllPostsController);
router.get('/admin/postsPendentes', authAdmin, getPendingPostsController);
router.patch('/admin/usuarios/:id/aprovar', authAdmin, approveOrRejectUserController);
router.patch('/admin/post/:id/aprovar', authAdmin, approveOrRejectPostController);
router.get('/admin/usuarios', authAdmin, listAllUsersController);
router.get('/admin/usuariosPendentes', authAdmin, listPendingUsersController);
router.patch('/admin/:id/redefinir-senha', authAdmin, redefinirSenhaAdminController);

router.get('/arquivo-temp/:id', authUserOrAdmin, gerarLinkTemporarioController);
router.get('/arquivo-download/:id', baixarArquivoComTokenController);

export default router;
