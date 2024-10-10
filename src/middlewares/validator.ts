import { Request, Response, NextFunction } from 'express';
import { checkSchema, validationResult } from 'express-validator';

export const validateUser = [
  checkSchema({
    name: {
      isString: true,
      notEmpty: true,
      errorMessage: 'Name is required and must be a string',
    },
    email: {
      isEmail: true,
      errorMessage: 'Valid email is required',
    },
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
