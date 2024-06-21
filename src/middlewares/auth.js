const apiKey = '8f94826adab8ffebbeadb4f9e161b2dc';

const authenticate = (req, res, next) => {
  const key = req.header('x-api-key');
  if (key === apiKey) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};

module.exports = authenticate;
