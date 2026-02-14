import * as authUseCase from '../usecases/authUseCase.js';

export const register = async (req, res, next) => {
  try {
    const result = await authUseCase.registerUseCase(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authUseCase.loginUseCase(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
