import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import NotFoundPage from "./pages/NotFound";
import { BookProvider } from "./context/BookContext";

function App() {

  return (
    <BookProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </BookProvider>
  )
}

export default App;
