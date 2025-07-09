import { DOMUtils, IconUtils } from '../utils/dom.js';
export class ContentRenderer {
    static renderContactInfo(contactInfo) {
        const container = DOMUtils.querySelector('.contact-info');
        if (!container)
            return;
        container.innerHTML = contactInfo.map(info => {
            const content = `${info.icon} ${info.text}`;
            return info.href
                ? `<a href="${info.href}" class="contact-item">${content}</a>`
                : `<span class="contact-item">${content}</span>`;
        }).join('');
    }
    static renderSocialLinks(socialLinks) {
        const container = DOMUtils.querySelector('.social-links');
        if (!container)
            return;
        container.innerHTML = socialLinks.map(link => `<a href="${link.href}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="${link.label}">
                <span>${IconUtils.getSocialIcon(link.label)}</span>
            </a>`).join('');
    }
    static renderEducation(education) {
        const container = DOMUtils.querySelector('#education .container');
        if (!container)
            return;
        const educationHTML = `
            <div class="card education-card fade-in">
                <h3 class="card-title">${education.institution}</h3>
                <div class="card-meta">${education.location} | ${education.period}</div>
                <p><strong>${education.degree}</strong></p>
                <div class="gpa"><strong>GPA:</strong> ${education.gpa}</div>
                <div class="honors">
                    <strong>Honors:</strong> ${education.honors.join(', ')}
                </div>
            </div>
        `;
        container.innerHTML = educationHTML;
    }
    static renderExperiences(experiences) {
        const container = DOMUtils.querySelector('#experience .container');
        if (!container)
            return;
        const experiencesHTML = experiences.map(exp => `
            <div class="card fade-in">
                <h3 class="card-title">${exp.title}</h3>
                <div class="card-meta">${exp.company} | ${exp.location} | ${exp.period}</div>
                <div class="card-content">
                    <ul>
                        ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
        container.innerHTML = experiencesHTML;
    }
    static renderProjects(projects) {
        const container = DOMUtils.querySelector('.projects-grid');
        if (!container)
            return;
        const projectsHTML = projects.map(project => `
            <div class="card project-card fade-in">
                <h3 class="card-title">${project.title}</h3>
                <div class="card-meta">${project.period}</div>
                <p>${project.description}</p>
                <div class="tech-stack">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link"><span>🔗 GitHub</span></a>` : ''}
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link"><span>🌐 Live Demo</span></a>` : ''}
                </div>
            </div>
        `).join('');
        container.innerHTML = projectsHTML;
    }
    static renderAwards(awards) {
        const container = DOMUtils.querySelector('#awards .container');
        if (!container)
            return;
        const awardsHTML = awards.map(award => `
            <div class="card award-card fade-in">
                <h3 class="card-title">${award.title}</h3>
                <div class="card-meta">${award.organization} | ${award.date}</div>
            </div>
        `).join('');
        container.innerHTML = awardsHTML;
    }
    static renderSkills(skillCategories) {
        const container = DOMUtils.querySelector('.skills-grid');
        if (!container)
            return;
        const skillsHTML = skillCategories.map(category => `
            <div class="card skill-category fade-in">
                <h3>${category.title}</h3>
                <div class="skill-list">
                    ${category.skills.map(skill => `<span class="skill-item"><span>${skill}</span></span>`).join('')}
                </div>
            </div>
        `).join('');
        container.innerHTML = skillsHTML;
    }
}
