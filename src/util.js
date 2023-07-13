const sanitizeValue = (value) => {
  if (typeof value === "string") {
    // Use regex to remove non-alphanumeric characters
    return value.replace(/[^a-zA-Z0-9-_ ]/g, "");
  }
  return value;
};

/**
 *@description Must be written within a trycatch block to get desired result
 *@param any error
 *@param int code
 *@param returnError false means throws error instead of returning it
 **/
const createError = (error, code = 500, returnError = false) => {
  const err = new Error(error);
  const newErr = Object.assign(err, { status: code });
  switch (returnError) {
    case false:
      throw newErr;
    case true:
      return newErr;
  }
};

const sanitizeData = (data) => {
  if (Array.isArray(data)) {
    // If the input is an array
    return data.map((obj) => {
      const sanitizedObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitizedObj[key] = sanitizeValue(obj[key]);
        }
      }
      return sanitizedObj;
    });
  } else if (typeof data === "object") {
    // If the input is a single object
    const sanitizedData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedData[key] = sanitizeValue(data[key]);
      }
    }
    return sanitizedData;
  } else {
    // Invalid input type
    return data;
  }
};

// const inMemory = Math.floor(1234 + Math.random() * 9999);

module.exports = {
  isFalsy: ["", null, undefined],

  transformDate: (date) => {
    const today = new Date(date);
    const td = today.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return td;
  },

  transformDateTime: (date) => {
    const today = new Date(date);
    const td = today.toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h12",
    });
    return td.toUpperCase();
  },

  today: () => {
    const today = new Date();
    const td = today.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return td;
  },
  sanitizeValue,
  createError,
  createResponse: (status, data) => {
    return {
      status: status,
      data: data,
    };
  },
  sanitizeData,
};
