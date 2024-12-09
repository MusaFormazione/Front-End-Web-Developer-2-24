module.exports.sleep = (req, res, next) => {
  const sleepTime = req.query.sleep || 1000;
  setTimeout(() => next(), sleepTime);
};
