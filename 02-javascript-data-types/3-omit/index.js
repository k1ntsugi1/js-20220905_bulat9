/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (startObj, ...fields) => {
    const objOfFields  = fields.reduce((acc, item) => {
        acc[item] = item;
        return acc;
    }, {});
    const getOmittedObj = (currentObj) => {
        const reducedCurrentObj = Object.entries(currentObj).reduce((acc, [key, value]) => {
            if (!objOfFields[key]) {
                acc[key] = typeof value === 'object' ? getOmittedObj(value) : value;
            }
            return acc;
        }, {});
        return reducedCurrentObj;
    };
    return getOmittedObj(startObj);

};
