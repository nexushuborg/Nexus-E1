import { Linkedin, Github, Mail } from "lucide-react";

export function Footer() {
  const linkStyle = `
    flex items-center gap-2 text-muted-foreground hover:text-[#F000FF] 
    transition-colors duration-200
  `;

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        
        {/* Copyright */}
        <div className="text-muted-foreground">
          © {new Date().getFullYear()} Algologs
        </div>

        {/* Social and Contact Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="https://www.linkedin.com/company/coding-ninjas-10x-iter/" target="_blank" rel="noopener noreferrer" className={linkStyle}>
            <Linkedin className="h-4 w-4" />
            Coding Ninjas 10X ITER
          </a>
          <a href="https://www.linkedin.com/company/nexus-hub-cnxiter/" target="_blank" rel="noopener noreferrer" className={linkStyle}>
            <Linkedin className="h-4 w-4" />
            Nexus Hub
          </a>
          <a href="https://github.com/CNxITER" target="_blank" rel="noopener noreferrer" className={linkStyle}>
            <Github className="h-4 w-4" />
            CNxITER
          </a>
          <a href="mailto:cn10xiter@gmail.com" className={linkStyle}>
            <Mail className="h-4 w-4" />
            cn10xiter@gmail.com
          </a>
        </div>

      </div>
    </footer>
  );
}
