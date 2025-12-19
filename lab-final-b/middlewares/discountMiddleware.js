const applyDiscount = (req, res, next) => {
    const couponCode = req.query.coupon || req.body.coupon;
    let discountPercent = 0;

    if (couponCode === 'SAVE10') {
        discountPercent = 10;
    }

    req.discountInfo = {
        code: couponCode,
        percent: discountPercent
    };
    next();
};

module.exports = applyDiscount;
