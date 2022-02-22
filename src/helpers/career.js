const getActiveCareer = (careers) => {
  const [activeCareer] = careers.filter((career) => career.active);

  if (activeCareer) {
    return activeCareer;
  }

  return null;
};

module.exports = {
  getActiveCareer,
};
