import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { credentialSchema } from '../schema/credential';
import { issuanceService } from '../services/issuance.service';

export const issueRouter = Router();

issueRouter.post('/api/issue', validateBody(credentialSchema), (req, res) => {
  const result = issuanceService.issue(req.body);

  if (result.status === 'new') {
    return res.status(201).json({
      message: result.message,
      credentialId: result.credentialId,
      issuedBy: result.issuedBy,
      issuedAt: result.issuedAt,
      payload: result.payload
    });
  }

  // already issued
  return res.status(200).json({
    message: result.message, // "already issued"
    credentialId: result.credentialId,
    issuedBy: result.issuedBy,
    issuedAt: result.issuedAt
  });
});
