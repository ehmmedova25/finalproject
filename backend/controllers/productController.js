import Product from "../models/Product.js";
import Order from "../models/Order.js"; // ⬅️ Bu import əlavə olunmalıdır
import mongoose from "mongoose";
import Category from "../models/Category.js";
export const createProduct = async (req, res) => {
  try {
    console.log("📦 POST məhsul:", req.body);

 const {
  name,
  description,
  images,
  price,
  discountPrice,
  category,
  location,
  stock,
  measurements, // ✅ əlavə et
} = req.body;

const parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
const parsedMeasurements = typeof measurements === "string" ? JSON.parse(measurements) : measurements;

const newProduct = new Product({
  name,
  description,
  images: Array.isArray(images) ? images : [images],
  price: Number(price),
  discountPrice: Number(discountPrice),
  category,
  location: parsedLocation,
  stock: Number(stock),
  measurements: parsedMeasurements,
  user: req.user._id, // ✅ vacib düzəliş
});


    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("🔥 CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Məhsul əlavə olunmadı", error: error.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    console.log("📥 QUERY:", req.query);

    const { category, location } = req.query;
    let filter = {};

    if (category && category !== "All") {
      const catDoc = await Category.findOne({ name: category });
      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        // Əgər düzgün category tapılmadısa boş nəticə qaytar
        return res.status(200).json([]);
      }
    }

    if (location && location !== "All") {
      filter.location = { $elemMatch: { value: location } };
    }

    const products = await Product.find(filter)
      .populate("category")
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
    console.error("🔥 GET PRODUCTS ERROR:", error.message);
    res.status(500).json({
      message: "Məhsullar gətirilə bilmədi",
      error: error.message,
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    console.log("🔍 Product ID:", req.params.id);
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("ratings.user", "firstName lastName");

    if (!product) return res.status(404).json({ message: "Məhsul tapılmadı" });

    res.status(200).json(product);
  } catch (error) {
    console.error("🔥 PRODUCT DETAILS ERROR:", error);
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
export const rateProduct = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  try {
    console.log("📥 Rəy sorğusu:", {
      productId,
      rating,
      comment,
      user: req.user,
    });

    // 1. Token yoxlaması nəticəsində user mövcuddurmu?
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "İstifadəçi təsdiqlənməyib" });
    }

    // 2. Məhsulu tap
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Məhsul tapılmadı:", productId);
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    // 3. Daha əvvəl bu user rəy veribmi?
    const alreadyRated = product.ratings.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (alreadyRated) {
      console.log("⚠️ Rəy artıq verilib:", req.user.id);
      return res
        .status(409)
        .json({ message: "Siz artıq bu məhsula rəy vermisiniz" });
    }

   const newRating = {
  user: req.user._id, // <-- düzəliş burada
  rating: Number(rating),
  comment: comment.trim(),
  createdAt: new Date(),
  likes: [],
  dislikes: [],
  replies: [],
};

product.ratings.push(newRating);

if (!product.user) {
  console.log("⚠️ product.user sahəsi boşdur, təyin edilir:", req.user._id);
  product.user = req.user._id;
}

await product.save({ validateBeforeSave: false });

    const updatedProduct = await Product.findById(productId)
      .populate("category")
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    const addedRating = updatedProduct.ratings.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    res.status(200).json({
      message: "Rəy əlavə olundu",
      newRating: addedRating,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("🔥 RATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Reytinq əlavə edilərkən xəta baş verdi",
      error: error.message || error,
    });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
const myProducts = await Product.find({ user: userId }).populate("category");

    res.status(200).json(myProducts);
  } catch (error) {
    console.error("MY PRODUCTS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Məhsul tapılmadı" });

    if (product.user.toString() !== req.user.id) {
  return res.status(403).json({ message: "İcazəniz yoxdur" });
}


    await product.deleteOne();
    res.status(200).json({ message: "Məhsul silindi" });
  } catch (error) {
    res.status(500).json({ message: "Silinərkən xəta baş verdi" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    console.log("🔄 UPDATE PRODUCT:", req.params.id);
    console.log("📝 UPDATE DATA:", req.body);

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Məhsul tapılmadı" });

  if (product.user.toString() !== req.user.id) {
  return res.status(403).json({ message: "İcazəniz yoxdur" });
}


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

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (images !== undefined) product.images = Array.isArray(images) ? images : [images];
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (category !== undefined) product.category = category;
    if (location !== undefined) {
      product.location = typeof location === "string" ? JSON.parse(location) : location;
    }
    if (stock !== undefined) product.stock = stock;

    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("🔥 UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Redaktə zamanı xəta baş verdi", error: error.message });
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
export const getBestSellers = async (req, res) => {
  try {
    const bestSellingProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories", 
          localField: "product.category",
          foreignField: "_id",
          as: "product.category"
        }
      },
      { $unwind: { path: "$product.category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          price: "$product.price",
          discountPrice: "$product.discountPrice",
          images: "$product.images",
          category: "$product.category",
          totalSold: 1,
        }
      }
    ]);

    res.status(200).json(bestSellingProducts);
  } catch (error) {
    console.error("🔥 BEST SELLERS ERROR:", error.message);
    res.status(500).json({ message: "Ən çox satılan məhsullar alınmadı", error: error.message });
  }
};
export const getTopBestSellers = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          price: "$product.price",
          discountPrice: "$product.discountPrice",
          images: "$product.images",
          category: "$product.category",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error("🔥 BEST SELLERS ERROR:", error.message);
    res.status(500).json({ message: "Ən çox satılanlar alınmadı", error: error.message });
  }
};
export const getBestSellersHome = async (req, res) => {
  try {
    const bestSellingProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 4 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "product.category"
        }
      },
      { $unwind: { path: "$product.category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          price: "$product.price",
          discountPrice: "$product.discountPrice",
          images: "$product.images",
          category: "$product.category",
          totalSold: 1,
        }
      }
    ]);

    res.status(200).json(bestSellingProducts);
  } catch (error) {
    console.error("🔥 BEST SELLERS HOME ERROR:", error.message);
    res.status(500).json({ message: "Ən çox satılanlar alınmadı", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    console.log("🔍 Kateqoriya axtarılır:", categoryName);

    const category = await Category.findOne({ 
      name: { $regex: new RegExp(categoryName, "i") } 
    });

    if (!category) {
      return res.status(404).json({ 
        message: "Kateqoriya tapılmadı",
        products: [],
        category: null
      });
    }

    const products = await Product.find({ category: category._id })
      .populate("category")
      .populate("ratings.user", "firstName lastName")
      .lean();

    const withAverageRating = products.map((product) => {
      const ratings = product.ratings || [];
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
          : 0;

      return { ...product, averageRating };
    });

    res.status(200).json({
      category,
      products: withAverageRating,
      total: withAverageRating.length
    });
  } catch (error) {
    console.error("🔥 GET PRODUCTS BY CATEGORY ERROR:", error.message);
    res.status(500).json({
      message: "Kateqoriya məhsulları gətirilə bilmədi",
      error: error.message,
      products: [],
      category: null
    });
  }
};
export const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, limit = 4 } = req.query;

    const similarProducts = await Product.find({
      _id: { $ne: id },
      category: categoryId,
    })
      .limit(Number(limit))
      .populate("category");

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error("🔥 SIMILAR PRODUCTS ERROR:", error.message);
    res.status(500).json({ message: "Oxşar məhsullar tapılmadı", error: error.message });
  }
};

export const likeProductRating = async (req, res) => {
  try {
    const { productId, ratingId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    const rating = product.ratings.id(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rəy tapılmadı" });
    }

    if (rating.likes.includes(userId)) {
      rating.likes = rating.likes.filter(id => id.toString() !== userId);
    } else {
      rating.likes.push(userId);
      rating.dislikes = rating.dislikes.filter(id => id.toString() !== userId);
    }

    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate("category")
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("🔥 LIKE RATING ERROR:", error);
    res.status(500).json({ message: "Like əlavə edilə bilmədi", error: error.message });
  }
};

export const dislikeProductRating = async (req, res) => {
  try {
    const { productId, ratingId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    const rating = product.ratings.id(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rəy tapılmadı" });
    }

    if (rating.dislikes.includes(userId)) {
      rating.dislikes = rating.dislikes.filter(id => id.toString() !== userId);
    } else {
      rating.dislikes.push(userId);
      rating.likes = rating.likes.filter(id => id.toString() !== userId);
    }

    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate("category")
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("🔥 DISLIKE RATING ERROR:", error);
    res.status(500).json({ message: "Dislike əlavə edilə bilmədi", error: error.message });
  }
};

export const replyToProductRating = async (req, res) => {
  try {
    const { productId, ratingId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Cavab boş ola bilməz" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    const rating = product.ratings.id(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rəy tapılmadı" });
    }

    const newReply = {
      user: userId,
      comment: comment.trim(),
      createdAt: new Date()
    };

    if (!rating.replies) {
      rating.replies = [];
    }

    rating.replies.push(newReply);
    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate("category")
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("🔥 REPLY RATING ERROR:", error);
    res.status(500).json({ message: "Cavab əlavə edilə bilmədi", error: error.message });
  }
};
