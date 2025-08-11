import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-[70vh] grid place-items-center">
      <Helmet>
        <title>404 – Page Not Found</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <link rel="canonical" href={location.pathname} />
      </Helmet>
      <section className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Button asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      </section>
    </main>
  );
};

export default NotFound;
