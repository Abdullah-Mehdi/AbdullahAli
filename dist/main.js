import { contactInfo, socialLinks, education, experiences, projects, awards, skillCategories } from './data/portfolio.js';
import { ContentRenderer } from './components/ContentRenderer.js';
import { PDFViewer } from './components/PDFViewer.js';
import { DOMUtils } from './utils/dom.js';
export class PersonalWebsite {
    constructor() {
        this.pdfViewer = new PDFViewer();
        this.init();
    }
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.renderAllSections();
            this.setupFeatures();
        });
    }
    renderAllSections() {
        ContentRenderer.renderContactInfo(contactInfo);
        ContentRenderer.renderSocialLinks(socialLinks);
        ContentRenderer.renderEducation(education);
        ContentRenderer.renderExperiences(experiences);
        ContentRenderer.renderProjects(projects);
        ContentRenderer.renderAwards(awards);
        ContentRenderer.renderSkills(skillCategories);
    }
    setupFeatures() {
        DOMUtils.setupScrollAnimations();
        DOMUtils.setupSmoothScrolling();
    }
}
new PersonalWebsite();
