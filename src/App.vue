<template>
  <div id="lookup-widget">
    <section id="lookup-widget__input-container">
      <label>Enter your address:</label>
      <input type="text" placeholder="Address..." v-model="userAddress" />
      <button type="button" @click="submitAddress">Lookup</button>
    </section>

    <section id="lookup-widget__results_container">
      <representativeView
        v-for="(item, index) in queryResults.results"
        :key="index"
        :metaData="item"
      />
    </section>

    <section id="lookup-widget__error-container" v-if="isError">
      <div v-if="isError===1">
        We weren't able to find any results for the address given. For the most accurate results, please make sure your address is formatted like so
        <i>123 Main St Chicago, IL</i>
      </div>
      <div
        v-if="isError===2"
      >The lookup tool is not functioning at this time. We apologize for any inconvenience and are working to restore this service as soon as possible.</div>
    </section>

    <section id="lookup-widget__debug-container" v-if="isDevMode">
      <hr />
      <h4>Debug</h4>
      <small>Only visible in development mode</small>
      <pre>{{queryResults}}</pre>
    </section>
  </div>
</template>

<script>
import civicDataLookup from "./lib/google-civic-api";
import representativeView from "./components/RepresentativeView";

export default {
  name: "App",
  components: { representativeView },
  data() {
    return {
      userAddress: "",
      queryResults: [],
      isError: 0,
      isDevMode: process.env.NODE_ENV === "development" ? true : false
    };
  },
  methods: {
    submitAddress: async function() {
      //Reset the error flag
      this.isError = 0;

      //Filter by state Senate and House only
      //Filter options here: https://developers.google.com/civic-information/docs/v2/representatives/representativeInfoByAddress
      let configOverride = {
        filterBy: {
          levels: ["administrativeArea1"],
          roles: ["legislatorUpperBody", "legislatorLowerBody"]
        }
      };

      //Query address
      this.queryResults = await civicDataLookup(
        this.userAddress,
        configOverride
      );

      //Handle errors for the view
      if (!this.queryResults.ok) {
        this.errorHandler();
      }
    },
    errorHandler() {
      this.isError = this.queryResults.errorType;
      if (this.isError === 2) {
        console.error(
          "** Lookup Widget encountered the following error: ",
          this.queryResults.errorMsg
        );
      }
    }
  }
};
</script>

<style scoped>
#lookup-widget {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#lookup-widget__results_container {
  margin-top: 40px;
}

#lookup-widget__debug-container {
  margin-top: 100px;
}

pre {
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1em;
  min-width: 300px;
  max-width: 600px;
  width: 100%;
  overflow: scroll;
}

#lookup-widget__error-container {
  background-color: #eee;
  padding: 3em;
  margin-top: 20px;
}

label {
  font-size: 18px;
  font-weight: bold;
}

input[type="text"] {
  font-size: 16px;
  padding: 4px 8px;
  min-width: 250px;
  margin-left: 15px;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 3px 0 0 3px;
}

button[type="button"] {
  font-size: 16px;
  padding: 4px 8px;
  background-color: #c81704;
  font-weight: bold;
  border-radius: 0;
  color: #fff;
  border: 1px solid #c81704;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="button"]:hover {
  background-color: #94180a;
}
</style>
