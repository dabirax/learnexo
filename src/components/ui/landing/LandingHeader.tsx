import Logo from "../Logo";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import { NavigationSheet } from "./NavigationSheet";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <nav className="h-16 bg-background border-b sticky top-0 left-0">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <Navbar className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Link to="/onboarding/auth/signup">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign Up
            </Button>
          </Link>

          <Link to="/onboarding/auth/login">
            <Button>Login</Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
