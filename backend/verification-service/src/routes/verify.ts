import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { credentialSchema } from '../schema/credential';
import { verificationService } from '../services/verification.service';

export const verifyRouter = Router();

verifyRouter.post('/api/verify', validateBody(credentialSchema), (req, res) => {
  const result = verificationService.verify(req.body);
console.log(credentialSchema);
  if (result.valid) {
    return res.status(200).json(result);
  }
  return res.status(200).json(result); // still 200 with valid:false (API design choice)
});
