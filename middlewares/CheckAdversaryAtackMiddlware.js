const { check, validationResult } = require('express-validator');

async function validateParams(req, res, next) {
    var rules;
    const entries = [...Object.entries(req.body), ...Object.entries(req.query), ...Object.entries(req.params)];
    for (const [key, value] of entries) {
         rules = [
            check(key).isNumeric().escape()
          ];
    }
   await rules;  
    Promise.all(rules.map(rule => rule.run(req)))
      .then(() => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      })
      .catch(next);
  }
module.exports = validateParams;
