function delayHandler(paramName, min, max) {
    return function(req, res, next) {
        if (req.query[paramName]) {
            try {
                let delay = parseInt(req.query[paramName], 10);
                delay = Math.min(max, delay);
                delay = Math.max(min, delay);
                setTimeout(next, delay);
                return;
            } catch (e) {
                // drop through
            }
        }
        next();
    };
}

module.exports = delayHandler;
