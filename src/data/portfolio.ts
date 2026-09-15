import type { Project, SectionMeta } from "../types";
import type { ComponentType } from "react";
import * as S from "../components/sections";

export const sectionComponents: Record<string, ComponentType> = {
  "inicio": S.Inicio,
  "sobre-mi": S.SobreMi,
  "stack": S.Stack,
  "proyectos": S.Proyectos,
  "contacto": S.Contacto,
};

export const profile = {
  name: "Carlos",
  role: "Desarrollador full stack",
  summary: "Construyo aplicaciones web de principio a fin.",
};

export const projects: Project[] = [
  {
    id: "p1",
    title: "Tienda WooCommerce",
    description: "Ecommerce con pasarela de pago y gestión de inventario.",
    tags: ["WordPress", "PHP", "MySQL"],
    url: "https://example.com/",
  },
  {
    id: "p2",
    title: "Microservicio de registros",
    description: "Servicio Python con arquitectura hexagonal y mensajería.",
    tags: ["Python", "RabbitMQ", "Docker"],
  },
  {
    id: "p3",
    title: "Portal corporativo",
    description: "Sitio institucional multiidioma con gestión de contenidos.",
    tags: ["Drupal", "PHP"],
  },
];

export const sections: SectionMeta[] = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "stack", label: "Stack" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
];

export const stack: string[] = [
  "PHP", "Drupal", "WordPress", "Python", "Django",
  "React", "TypeScript", "Docker", "Git", "MySQL",
];