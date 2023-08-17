import { GlobalDataProvider } from "@/components/hooks/GlobalContext";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Toast from "@/components/common/toast/Toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <GlobalDataProvider>
        <Component {...pageProps} />
        <Toast />
      </GlobalDataProvider>
    </SessionProvider>
  );
}
