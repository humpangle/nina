const path = require("path");

module.exports = {
  siteMetadata: {
    title: "Nina"
  },

  plugins: [
    "gatsby-plugin-typescript",

    {
      resolve: "gatsby-source-filesystem",

      options: {
        name: "images",

        path: path.join(__dirname, "src", "images")
      }
    },

    "gatsby-plugin-sharp",

    "gatsby-transformer-sharp",

    {
      resolve: "gatsby-plugin-env-variables",

      options: {
        whitelist: ["API_URL"]
      }
    },

    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Nina - your purse",
        short_name: "Nina",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#ff5b00",
        // Enables "Add to Home screen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: "standalone",
        icon: "src/images/logo.png" // This path is relative to the root of the site.
      }
    },

    "gatsby-plugin-offline",

    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    },

    "gatsby-plugin-sass",

    "gatsby-plugin-less",

    "gatsby-plugin-netlify"
  ]
};
