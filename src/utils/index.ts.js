'use strict'
import _ from "lodash";

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(e => [e, 1]));
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(e => [e, 0]));
}

const removeUndefinedOrNullObject = obj => {
    let cloneObj = {};
    if (!obj) return;

    Object.keys(obj).forEach(k => {
        if (obj[k] === undefined) return;

        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const results = removeUndefinedOrNullObject(obj[k])
            cloneObj = {...cloneObj, ...results};
        }

        if (obj[k] !== null) {
            cloneObj = {...cloneObj, [k]: obj[k]};
        }
    })

    return cloneObj;
}

export {getInfoData, getSelectData, getUnSelectData, removeUndefinedOrNullObject}