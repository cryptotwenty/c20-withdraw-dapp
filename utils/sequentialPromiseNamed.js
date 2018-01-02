const Promise = require("bluebird");

/**
 * @param {!Object.<function.<Promise.<Any>>>} promiseObject. Each key maps to a function
 * that returns a promise.
 * @returns {!Promise.<Object.<Any>>} The results of the promises passed to the function.
 */
module.exports = function sequentialPromiseNamed(promiseObject) {
    const result = Object.keys(promiseObject).reduce(
        (reduced, key) => {
            return {
                chain: reduced.chain
                    .then(() => promiseObject[ key ]())
                    .then(result => reduced.results[ key ] = result),
                results: reduced.results
            };
        },
        {
            chain: Promise.resolve(),
            results: {}
        });
    return result.chain.then(() => result.results);
};