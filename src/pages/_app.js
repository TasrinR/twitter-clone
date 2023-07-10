import { GlobalDataProvider } from "@/components/hooks/GlobalContext";
import "@/styles/globals.css";
import mongoose from "mongoose";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const handleMongoConnect = async () => {
    try {
      if (mongoose.connection?.readyState !== 1) {
        // mongoose.set("strictQuery", true);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          useMongoClient: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        return conn;
      }
    } catch (err) {
      console.log(err);
    }
  };
  handleMongoConnect();
  return (
    <SessionProvider session={session}>
      <GlobalDataProvider>
        <Component {...pageProps} />
      </GlobalDataProvider>
    </SessionProvider>
  );
}
