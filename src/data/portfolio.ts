import type { SiteData } from "../lib/api";

/**
 * Copia de respaldo del contenido de la API.
 * Se usa solo si https://greedent.pythonanywhere.com/api/site/ no responde.
 * Actualízala a mano cuando cambies contenido importante en el admin.
 *
 * Las imágenes van a null a propósito: si la API está caída,
 * las imágenes alojadas en PythonAnywhere tampoco cargan.
 */
export const fallbackSite: SiteData = {
  profile: {
    name: "Carlos Alejandro Remón Ortiz",
    role: "Desarrollador de Software | Web & CMS",
    summary:
      "Desarrollador de software recién graduado con experiencia en WordPress, " +
      "Drupal y WooCommerce, y conocimientos en React y Django. Me apasiona crear " +
      "soluciones web eficientes, aprender nuevas tecnologías y convertir ideas en " +
      "productos funcionales.",
    email: "carlosalejandroremonortiz@gmail.com",
    avatar: null,
  },
  sections: [
    {
      slug: "inicio", kind: "hero", nav_label: "Inicio",
      heading: "", body: "", image: null, content: {},
    },
    {
      slug: "sobre-mi", kind: "text", nav_label: "Sobre mí",
      heading: "", body: "", image: null, content: {},
    },
    {
      slug: "stack", kind: "skills", nav_label: "Stack",
      heading: "", body: "", image: null,
      content: {
        skills: [
          { id: 1, name: "HTML", category: "Frontend" },
          { id: 2, name: "CSS", category: "Frontend" },
          { id: 3, name: "JavaScript", category: "Frontend" },
          { id: 4, name: "React", category: "Frontend" },
          { id: 5, name: "SASS / SCSS", category: "Frontend" },
          { id: 6, name: "Bootstrap", category: "Frontend" },
          { id: 7, name: "Tailwind", category: "Frontend" },
          { id: 8, name: "Twig", category: "Frontend / Templates" },
          { id: 9, name: "PHP", category: "Backend" },
          { id: 10, name: "Python", category: "Backend" },
          { id: 11, name: "Django", category: "Backend" },
          { id: 12, name: "WordPress", category: "CMS" },
          { id: 13, name: "Drupal", category: "CMS" },
          { id: 14, name: "Git", category: "Herramientas" },
          { id: 15, name: "GitHub", category: "Herramientas" },
          { id: 16, name: "MySQL", category: "Bases de datos" },
          { id: 17, name: "phpMyAdmin", category: "Bases de datos" },
        ],
      },
    },
    {
      slug: "proyectos", kind: "projects", nav_label: "Proyectos",
      heading: "", body: "", image: null,
      content: {
        projects: [
          {
            id: 1,
            title: "Desarrollador | Freelancer 2024-2026",
            description:
              "Desarrollando sistemas como desarrollador frontend y backend " +
              "informatizando procesos como gestión documental, gestión " +
              "informacional de sistemas, blogs, foros, encuestas e interacción " +
              "con el usuario final.",
            image: null, url: "", repo_url: "", tags: [],
          },
          {
            id: 2,
            title: "Desarrollador | Contraloría General de la República de Cuba",
            description:
              "Desarrollo de la aplicación web de la intranet de la institución, " +
              "informatizando procesos como gestión de resoluciones, documentos y " +
              "sistema de control interno.",
            image: null, url: "", repo_url: "",
            tags: [
              "Bootstrap", "Drupal", "Git", "JavaScript", "MySQL",
              "PHP", "SASS / SCSS", "Twig", "phpMyAdmin",
            ],
          },
          {
            id: 3,
            title: "Desarrollador | EIGE 2025",
            description: "Desarrollador Full Stack.",
            image: null, url: "https://eigecuba.com/", repo_url: "",
            tags: ["Bootstrap", "Django", "Git", "GitHub", "JavaScript", "Python"],
          },
        ],
      },
    },
    {
      slug: "contacto", kind: "contact", nav_label: "Contacto",
      heading: "", body: "", image: null, content: {},
    },
  ],
};