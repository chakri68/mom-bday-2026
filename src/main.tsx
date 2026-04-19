import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import BirthdayExperience from "./BirthdayExperience";
import content from "./content";

document.title = content.siteTitle;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BirthdayExperience />
  </StrictMode>,
);
