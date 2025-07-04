import Order from "../models/Order.js";
import User from "../models/User.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: { $ne: "admin" } });

    const incomeResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

    const recentOrders = await Order.find()
      .populate("user", "firstName lastName")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    const monthlyIncome = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ✅ Son 7 gün üçün sifariş sayını qrupla
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const weeklyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const weeklyCustomers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          role: { $ne: "admin" },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const weekDays = ["Bazar", "B.e", "Ç.a", "Çər", "C.a", "Cümə", "Şənbə"];

    const normalizeWeekData = (data) => {
      const countsByDay = data.reduce((acc, item) => {
        acc[item._id.day] = item.count;
        return acc;
      }, {});
      return weekDays.map((day, index) => ({
        day,
        count: countsByDay[index + 1] || 0,
      }));
    };

    res.json({
      totalOrders,
      totalCustomers,
      totalIncome,
      recentOrders,
      monthlyIncome,
      weeklyOrders: normalizeWeekData(weeklyOrders),
      weeklyCustomers: normalizeWeekData(weeklyCustomers),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Stats alınarkən xəta baş verdi" });
  }
};
