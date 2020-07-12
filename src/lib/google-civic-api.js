import "whatwg-fetch";

/**
 * Civic Data Lookup - Provide structured information on elected officials
 * using an address to lookup a region
 * Endpoint documentation here: https://developers.google.com/civic-information/docs/v2/representatives/representativeInfoByAddress
 * @param userAddress
 * @param userConfig
 */
export default async (userAddress, userConfig = {}) => {
  const config = {
    apiKey: process.env.VUE_APP_GOOGLE_CIVIC_API_KEY,
    endpoint: "https://content.googleapis.com/civicinfo/v2/representatives",
    includeOffices: true,
    filterBy: {},
  };

  //Override any config parameters with ones that were passed in
  Object.keys(userConfig).map((key) => (config[key] = userConfig[key]));

  //Let us override the api key if there is one attached to the global scope
  config.apiKey = window._google_civic_api_key || config.apiKey;

  //Create an object of endpoint parameters where key=value
  let params = {
    address: encodeURIComponent(userAddress),
    includeOffices: config.includeOffices,
    key: config.apiKey,
  };

  //Construct our query string
  let queryString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  //Append the filterBy values onto the query string
  Object.keys(config.filterBy).map(
    (key) =>
      (queryString +=
        "&" + config.filterBy[key].map((n) => `${key}=${n}`).join("&"))
  );

  //Construct the final endpoint query
  let query = `${config.endpoint}?${queryString}`,
    statusCode = null;

  //Return a promise from fetch
  return fetch(query)
    .then((res) => {
      //Check to make sure the request was successful
      statusCode = res.status;
      return res.json();
    })
    .then((data) => {
      //Catch errors in the response
      if ("error" in data) {
        throw new userException(2, data.error.message, data);
      }
      if (!("offices" in data) || !("officials" in data)) {
        throw new userException(1, "Empty results", data);
      }

      //Capture the index and name of the offices
      let needles = [];
      data.offices.forEach((office) => {
        office.officialIndices.forEach((n) => {
          needles.push({ office: office.name, index: n });
        });
      });

      //Now use the index to pull the metadata
      let output = {
        ok: true,
        query: query,
        httpStatus: statusCode,
        results: [],
      };

      needles.forEach((n) => {
        let official = data.officials[n.index];
        output.results.push({
          name: official.name,
          office: n.office,
          phone: getFirstArrayElement(official.phones),
          email: getFirstArrayElement(official.emails),
          address: getFirstArrayElement(official.address),
          image: official.photoUrl || null,
          webpage: getFirstArrayElement(official.urls),
          party: partyFormatter(official.party),
        });
      });
      return output;
    })
    .catch((err) => {
      if (!("type" in err) || !("msg" in err) || !("rawResponse" in err)) {
        err = {
          type: 2,
          msg: "Uncaught error",
          rawResponse: err,
        };
      }

      return {
        ok: false,
        query: query,
        httpStatus: statusCode,
        errorType: err.type,
        errorMsg: err.msg,
        rawResponse: err.rawResponse,
      };
    });
};

function partyFormatter(party) {
  if (!party) {
    return null;
  }
  if (party.includes("Democratic")) {
    return "D";
  }
  if (party.includes("Republican")) {
    return "R";
  }
  if (party.includes("Independent")) {
    return "I";
  }
  if (party.includes("Green")) {
    return "G";
  }
  return null;
}

function getFirstArrayElement(datum) {
  if (Array.isArray(datum)) {
    return datum[0];
  } else {
    return datum;
  }
}

function userException(type, msg, rawResponse) {
  this.type = type;
  this.msg = msg;
  this.rawResponse = rawResponse;
}
