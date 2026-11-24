import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Workshops from "@/pages/Workshops";
import WorkshopDetails from "@/pages/WorkshopDetails";
import Booking from "@/pages/Booking";
import BookingSuccess from "@/pages/BookingSuccess";
import PrivateWorkshops from "@/pages/PrivateWorkshops";
import About from "@/pages/About";
import Places from "@/pages/Places";
import GalleryPage from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";

/** Redirects the old `/booking/:slug` links to the current `/book/:workshopSlug` route. */
function LegacyBookingRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/book/${slug}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:slug" element={<WorkshopDetails />} />
          <Route path="/book/:workshopSlug" element={<Booking />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/booking/:slug" element={<LegacyBookingRedirect />} />
          <Route path="/private-workshops" element={<PrivateWorkshops />} />
          <Route path="/places" element={<Places />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
