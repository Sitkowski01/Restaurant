import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CookieConsent } from "./components/cookie-consent";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <CookieConsent />
    </>
  );
}
