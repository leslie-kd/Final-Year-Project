const User = require('../models/User');

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

// @desc    Get all providers (with location/region filtering)
// @route   GET /api/users/providers
// @access  Public
const getProviders = async (req, res) => {
  try {
    const { region, lat, lng, service, maxDistance = 50 } = req.query;

    let query = { roles: { $in: ['provider'] } };

    // Region filtering
    if (region) {
      query['location.region'] = { $regex: region, $options: 'i' };
    }

    // Service category filtering
    if (service) {
      query['providerDetails.jobTitle'] = { $regex: service, $options: 'i' };
    }

    // Fetch providers
    let providers = await User.find(query).select('-passwordHash');

    // GPS filtering (Haversine)
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      providers = providers.map(provider => {
        if (provider.location && provider.location.latitude && provider.location.longitude) {
          const distance = calculateDistance(
            userLat, userLng, 
            provider.location.latitude, provider.location.longitude
          );
          return { ...provider.toObject(), distance };
        }
        return { ...provider.toObject(), distance: null };
      }).filter(p => p.distance !== null && p.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
    }

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProviders
};
