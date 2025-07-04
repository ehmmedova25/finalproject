import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, customerInfo } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Sifariş elementi tapılmadı" });
    }

    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: product._id,
          quantity: item.quantity,
          seller: product.seller, 
        };
      })
    );

    const newOrder = new Order({
      user: userId,
      items: detailedItems,
      customerInfo,
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Sifariş yaradıldı", order: newOrder });

  } catch (err) {
    console.error("❌ Sifariş xətası:", err);
    res.status(500).json({ success: false, message: "Sifariş alınmadı" });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error("❌ Get my orders error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Sifarişlər alınarkən xəta baş verdi" 
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error("❌ Get all orders error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Sifarişlər alınarkən xəta baş verdi" 
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = ["pending", "processing", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Etibarsız status" 
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    )
    .populate("items.product", "name price images")
    .populate("user", "firstName lastName email");

    if (!updatedOrder) {
      return res.status(404).json({ 
        success: false,
        message: "Sifariş tapılmadı" 
      });
    }

    console.log(`✅ Order ${id} status updated to: ${status}`);

    res.status(200).json({ 
      success: true, 
      order: updatedOrder,
      message: "Status uğurla yeniləndi"
    });
  } catch (error) {
    console.error("❌ Update order status error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Status yenilənərkən xəta baş verdi" 
    });
  }
};



export const getOrdersForSeller = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find({ "items.seller": sellerId })
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price images");

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("❌ Seller orders error:", error.message);
    res.status(500).json({
      success: false,
      message: "Satıcının sifarişlərini alarkən xəta baş verdi",
    });
  }
};

