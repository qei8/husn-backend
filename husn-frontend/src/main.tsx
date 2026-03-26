import React from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import App from "./App.tsx";
import "./index.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_JgO14IdEb",
      userPoolClientId: "5gvtmffihjosdhn580p48f72hg",
      loginWith: {
        username: true,
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);