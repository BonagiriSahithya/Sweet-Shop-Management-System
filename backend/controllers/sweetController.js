const Sweet = require('../models/Sweet');

exports.addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || price == null || quantity == null) return res.status(400).json({ message: 'Missing fields' });

    const sweet = await Sweet.create({ name, category, price, quantity, createdBy: req.user._id });
    return res.status(201).json(sweet);
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return res.status(500).json({ message: 'Add sweet failed' });
  }
};

exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (!sweet.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not allowed' });

    Object.assign(sweet, req.body);
    await sweet.save();
    return res.json(sweet);
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (!sweet.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not allowed' });

    await sweet.deleteOne();
    return res.json({ message: 'Sweet deleted' });
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return res.status(500).json({ message: 'Delete failed' });
  }
};

exports.restockSweet = async (req, res) => {
  try {
    let { quantity } = req.body;
    quantity = Number(quantity); // convert to number

    if (!quantity || quantity <= 0) return res.status(400).json({ message: 'Invalid restock quantity' });

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

    sweet.quantity += quantity; // now this will correctly add numbers
    await sweet.save();
    return res.json({ sweet });
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return res.status(500).json({ message: 'Restock failed' });
  }
};

exports.getSweets = async (_req, res) => {
  try {
    const sweets = await Sweet.find();
    return res.json(sweets);
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return res.status(500).json({ message: 'Fetch failed' });
  }
};

exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const sweets = await Sweet.find(query);
    return res.json(sweets);
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return res.status(500).json({ message: 'Search failed' });
  }
};

exports.purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (sweet.quantity < 1) return res.status(400).json({ message: 'Out of stock' });

    sweet.quantity -= 1;
    await sweet.save();
    return res.json({ sweet });
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    return res.status(500).json({ message: 'Purchase failed' });
  }
};
