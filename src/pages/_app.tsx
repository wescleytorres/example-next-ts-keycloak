import cookie from "cookie";
import * as React from "react";
import type { IncomingMessage } from "http";
import type { AppProps, AppContext } from "next/app";

import { SSRKeycloakProvider, SSRCookies } from "@react-keycloak/ssr";
import { KEYCLOAK_CONFIG } from "../services/auth";

interface InitialProps {
  cookies: IncomingMessage;
}

function MyApp({ Component, pageProps, cookies }: AppProps & InitialProps) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={KEYCLOAK_CONFIG}
      persistor={SSRCookies(cookies)}
    >
      <Component {...pageProps} />
    </SSRKeycloakProvider>
  );
}

function parseCookies(req?: IncomingMessage) {
  if (!req || !req.headers) {
    return {};
  }
  return cookie.parse(req.headers.cookie || "");
}

MyApp.getInitialProps = async (context: AppContext) => {
  // Extract cookies from AppContext
  return {
    cookies: parseCookies(context?.ctx?.req),
  };
};

export default MyApp;
