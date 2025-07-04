import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      images,
      price,
      discountPrice,
      category,
      location,
      stock,
    } = req.body;

    const parsedLocation = typeof location === "string" ? JSON.parse(location) : location;

    const newProduct = new Product({
      name,
      description,
      images: Array.isArray(images) ? images : [images],
      price,
      discountPrice,
      category,
      location: parsedLocation,
      stock,
      seller: req.user.id,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Məhsul əlavə olunmadı", error: error.message });
  }
};

  export const getAllProducts = async (req, res) => {
  try {
    const { category, location } = req.query;
    let filter = {};

    if (category && category !== "All") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const catDoc = await Category.findOne({ name: category });
        if (catDoc) {
          filter.category = catDoc._id;
        }
      }
    }

    if (location && location !== "All") {
      filter.location = { $elemMatch: { value: location } };
    }

    const products = await Product.find(filter)
      .populate("category")
      .populate("seller", "firstName lastName")
      .lean();

    const withAverageRating = products.map((product) => {
      const ratings = product.ratings || [];
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
          : 0;

      return { ...product, averageRating };
    });

    res.status(200).json(withAverageRating);
  } catch (error) {
    res.status(500).json({ message: "Məhsullar gətirilə bilmədi", error: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("seller", "firstName lastName")
      .populate("ratings.user", "firstName lastName");
    if (!product) return res.status(404).json({ message: "Məhsul tapılmadı" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const rateProduct = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Məhsul tapılmadı" });

    const newRating = {
      user: req.user.id,
      rating,
      comment,
      createdAt: new Date()
    };

    product.ratings.push(newRating);
    await product.save();

    res.status(200).json({
      message: "Rəy əlavə olundu",
      newRating
    });
  } catch (error) {
    res.status(500).json({ message: "Reytinq xətası", error: error.message });
  }
};
export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const myProducts = await Product.find({ seller: userId }).populate("category");
    res.status(200).json(myProducts);
  } catch (error) {
    console.error("MY PRODUCTS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
// controllers/productController.js sonuna əlavə et:
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Məhsul tapılmadı" });

    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Bu məhsulu silmək üçün icazəniz yoxdur" });

    await product.deleteOne();
    res.status(200).json({ message: "Məhsul silindi" });
  } catch (error) {
    res.status(500).json({ message: "Silinərkən xəta baş verdi" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Məhsul tapılmadı" });

    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Redaktə etmək üçün icazəniz yoxdur" });

    const {
      name,
      description,
      images,
      price,
      discountPrice,
      category,
      location,
      stock,
    } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.images = Array.isArray(images) ? images : [images];
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.category = category || product.category;
    product.location = typeof location === "string" ? JSON.parse(location) : location;
    product.stock = stock || product.stock;

    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Redaktə zamanı xəta baş verdi" });
  }
};

export const getUniqueLocations = async (req, res) => {
  try {
    const products = await Product.find({}, "location");
    const allLocations = products.flatMap((p) => p.location || []);
    const unique = Array.from(new Set(allLocations.map((loc) => loc.value)));
    res.status(200).json(["All", ...unique]);
  } catch (error) {
    res.status(500).json({ message: "Lokasiyalar alınmadı", error: error.message });
  }
};
