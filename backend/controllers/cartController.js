import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const index = cart.items.findIndex((item) => item.product.toString() === productId);

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ message: "Əlavə olundu", cart });
  } catch (err) {
    res.status(500).json({ message: "Əlavə xətası", error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart) return res.status(200).json({ cart: { items: [] } });

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Səbət alınmadı", error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Səbət tapılmadı" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Məhsul səbətdə yoxdur" });

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ message: "Yeniləndi", cart });
  } catch (err) {
    res.status(500).json({ message: "Yenilənmə xətası", error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate("items.product");

    res.status(200).json({ message: "Silindi", cart });
  } catch (err) {
    res.status(500).json({ message: "Silinmə xətası", error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "Səbət təmizləndi" });
  } catch (error) {
    res.status(500).json({ message: "Səbət təmizlənərkən xəta", error: error.message });
  }
};
