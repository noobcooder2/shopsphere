const Wishlist = require('../models/Wishlist');

// @GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products');
    if (!wishlist) return res.json({ products: [] });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/wishlist/toggle
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    let action;

    if (index === -1) {
      wishlist.products.push(productId);
      action = 'added';
    } else {
      wishlist.products.splice(index, 1);
      action = 'removed';
    }

    await wishlist.save();
    res.json({ message: `Product ${action} from wishlist`, action });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWishlist, toggleWishlist };