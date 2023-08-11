import { hostDomain } from "../contracts/ref";

export const formatCertificate = (object) => {
  const result = {};

  // Iterate over the keys of the original object
  for (const key in object) {
    // Check if the key is a number or not
    if (!isNaN(key)) {
      continue; // Skip number keys
    }

    // Copy the value to the new object using the descriptive key
    if (object[key]?._isBigNumber) {
      result[key] = object[key].toNumber();
    } else {
      result[key] = object[key];
    }
  }

  return result;
};

export const formatCertificateID = (number) =>
  "NPRC-" + String(number).padStart(7, "0");

export const createLookup = (arr) => {
  const lookup = {};
  for (const obj of arr) {
    lookup[obj.id] = obj;
  }
  return lookup;
};

export const timestampToLocale = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

export const handleViewCertificate = (id) => {
    const URL = `${hostDomain}/certificate?id=${id.toNumber()}`;
    window.open(URL, "_blank");
  };