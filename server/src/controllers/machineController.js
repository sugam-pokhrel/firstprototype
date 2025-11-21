const Machine = require('../models/Machine');

// @desc    Get nearby machines
// @route   GET /api/machines/nearby
// @access  Public
exports.getNearby = async (req, res) => {
  try {
    console.log('getNearby called with query:', req.query);
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude',
      });
    }

    // Simple distance calculation (Haversine formula would be better for production)
    // For now, we'll use a bounding box approach
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Approximate degrees for radius (rough calculation)
    const latDelta = rad / 111; // 1 degree ≈ 111 km
    const lonDelta = rad / (111 * Math.cos(lat * Math.PI / 180));

    const machines = await Machine.find({
      available: true,
      latitude: {
        $gte: lat - latDelta,
        $lte: lat + latDelta,
      },
      longitude: {
        $gte: lon - lonDelta,
        $lte: lon + lonDelta,
      },
    }).populate('owner', 'name email phone');

    // Calculate distances and sort
    const machinesWithDistance = machines.map((machine) => {
      const distance = calculateDistance(
        lat,
        lon,
        machine.latitude,
        machine.longitude
      );
      return {
        ...machine.toObject(),
        distance,
      };
    });

    machinesWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: machinesWithDistance.length,
      data: machinesWithDistance,
    });
  } catch (error) {
    console.error('Error in getNearby:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create machine
// @route   POST /api/machines
// @access  Private
exports.createMachine = async (req, res) => {
  try {
    console.log('createMachine called with body:', req.body);
    console.log('User:', req.user);

    // Validation
    const { machineType, machineCount, pricePerHour, address, latitude, longitude } = req.body;

    if (!machineType || !machineCount || !pricePerHour || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: machineType, machineCount, pricePerHour, address, latitude, longitude',
      });
    }

    req.body.owner = req.user.id;

    const machine = await Machine.create(req.body);

    res.status(201).json({
      success: true,
      data: machine,
    });
  } catch (error) {
    console.error('Error creating machine:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get my machines
// @route   GET /api/machines/my
// @access  Private
exports.getMyMachines = async (req, res) => {
  try {
    const machines = await Machine.find({ owner: req.user.id });

    res.status(200).json({
      success: true,
      count: machines.length,
      data: machines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get machine by ID
// @route   GET /api/machines/:id
// @access  Public
exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Machine not found',
      });
    }

    res.status(200).json({
      success: true,
      data: machine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

