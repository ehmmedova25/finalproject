import Banner from "../models/Banner.js";
import cloudinary from "../utils/Cloudinary.js";

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ message: "Bannerlər alınmadı", error: err.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, link } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Şəkil yüklənməyib" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "banners",
    });

    const newBanner = new Banner({
      image: result.secure_url,
      title,
      link,
    });

    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    res.status(500).json({ message: "Banner əlavə olunmadı", error: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Banner silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silinmədi", error: err.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { title, link } = req.body;
    const bannerId = req.params.id;
    
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({ message: "Banner tapılmadı" });
    }

    if (req.file) {
      const publicId = banner.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`banners/${publicId}`);
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "banners",
      });
      banner.image = result.secure_url;
    }

    banner.title = title || banner.title;
    banner.link = link || banner.link;
    
    await banner.save();
    res.status(200).json(banner);
  } catch (err) {
    res.status(500).json({ message: "Banner yenilənmədi", error: err.message });
  }
};