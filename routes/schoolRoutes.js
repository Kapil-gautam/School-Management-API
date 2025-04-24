import express from 'express';
import db from '../db.js';

const router = express.Router();

// ✅ Add School
router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    // Check if a school with same latitude and longitude already exists
    const [existing] = await db.execute(
      'SELECT * FROM schools WHERE latitude = ? AND longitude = ?',
      [lat, long]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'A school with the same coordinates already exists' });
    }

    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, lat, long]
    );

    res.status(201).json({ message: 'School added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ List Schools
router.get('/listSchools', async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLong = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLong)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');
    const schoolsWithDistance = schools.map(school => {
      const distance = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) + Math.pow(userLong - school.longitude, 2)
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (error) {
    console.error('Error in /listSchools:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/testDB', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT NOW() AS current_time');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
