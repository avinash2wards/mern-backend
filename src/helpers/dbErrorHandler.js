// Full list err codes thrown from MongoDB server.
// https://github.com/mongodb/mongo/blob/34228dcee8b2961fb3f5d84e726210d6faf2ef4f/src/mongo/base/error_codes.yml

// This method will parse and return the
// err message associated with the specific validation err or other errors that can
// occur while querying MongoDB using Mongoose.

// Get the err message from err object
const getErrorMessage = (err) => {
  let message = "";

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      default:
        message = "Something went wrong";
        break;
    }
  } else {
    let errorList = [];
    for (let errName in err.errors) {
      if (err.errors[errName].message)
        errorList.push(err.errors[errName].message);
    }
    message = errorList.join(" , ");
  }
  return message;
};

// Get unique err field name
const getUniqueErrorMessage = (err) => {
  let output;
  try {
    let fieldName = err.message.substring(
      err.message.lastIndexOf(".$") + 2,
      err.message.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }
  return output;
};

module.exports = { getErrorMessage };
