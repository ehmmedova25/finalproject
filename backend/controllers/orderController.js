import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import stripe from "../utils/stripe.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, customerInfo, stripeSessionId } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Sifariş elementi tapılmadı" });
    }

    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product._id || item.product);
        if (!product) {
          throw new Error(`Məhsul tapılmadı: ${item.product._id || item.product}`);
        }
        return {
          product: product._id,
          quantity: item.quantity,
          seller: product.seller,
          price: product.discountPrice || product.price,
        };
      })
    );

    const totalAmount = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      user: userId,
      items: detailedItems,
      customerInfo,
      totalAmount,
      paymentStatus: "paid", 
      status: "confirmed", 
      stripeSessionId: stripeSessionId || null,
    });

    await newOrder.save();

    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ success: true, message: "Sifariş yaradıldı və səbət təmizləndi", order: newOrder });

  } catch (err) {
    console.error("❌ Sifariş xətası:", err);
    res.status(500).json({ success: false, message: "Sifariş alınmadı: " + err.message });
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
    const validStatuses = ["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"];
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

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.paymentStatus = "paid";
        order.status = "confirmed";
        order.deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        await order.save();
        console.log(`✅ Order ${order._id} payment confirmed via webhook`);

        await Cart.findOneAndDelete({ user: order.user });
        console.log(`🧹 Cart for user ${order.user} cleared after successful payment.`);
      }
    } catch (error) {
      console.error("Webhook update error:", error);
    }
  }

  res.status(200).json({ received: true });
};