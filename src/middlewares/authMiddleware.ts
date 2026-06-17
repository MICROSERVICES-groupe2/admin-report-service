import { Request, Response, NextFunction } from 'express';

// Middleware basique pour s'assurer que les accès au panel admin ou rapports sont autorisés.
// En production (selon le plan P5.1.3.2), Kong validera le JWT en amont et 
// injectera possiblement les infos de l'utilisateur dans les headers (ex: X-User-Role).

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Ceci est un stub. Intégrer avec les rôles (ADMIN/SUPER_ADMIN) une fois l'auth-service finalisé.
  const userRole = req.headers['x-user-role'] || 'ADMIN'; 
  
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Accès refusé. Rôle administrateur requis.' });
  }

  next();
};
