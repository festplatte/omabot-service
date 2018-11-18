class IbmWatson {
  constructor() {
    this.apiUrl =
      "https://gateway-fra.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2018-03-19";
    this.apiKey = process.env.NATURAL_LANGUAGE_UNDERSTANDING_API_KEY;
  }

  analyzeText(text) {
    return fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from("apikey:" + this.apiKey).toString("base64"),
        "X-Watson-Learning-Opt-Out": "true"
      },
      body: JSON.stringify({
        text: text,
        features: {
          entities: {},
          sentiment: {},
          keywords: {},
          categories: {}
        }
      })
    }).then(res => res.json());
  }
}

module.exports = IbmWatson;
