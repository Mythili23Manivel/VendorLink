import { getDashboardAnalyticsUseCase } from '../usecases/dashboardUseCase.js';

export const getDashboard = async (req, res, next) => {
  try {
    const analytics = await getDashboardAnalyticsUseCase();
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
};
