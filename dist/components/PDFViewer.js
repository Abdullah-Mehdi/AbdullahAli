import { DOMUtils } from '../utils/dom.js';
export class PDFViewer {
    constructor() {
        this.modal = null;
        this.viewer = null;
        this.isLoaded = false;
        this.pdfPath = 'assets/documents/Abdullah_Ali_Resume-9.pdf';
        this.init();
    }
    init() {
        this.modal = DOMUtils.getElementById('resumeModal');
        this.viewer = DOMUtils.getElementById('resumeViewer');
        this.setupEventListeners();
    }
    setupEventListeners() {
        const viewBtn = DOMUtils.getElementById('viewResumeBtn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => this.open());
            this.addKeyboardSupport(viewBtn, () => this.open());
        }
        const closeBtn = DOMUtils.getElementById('closeModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
            this.addKeyboardSupport(closeBtn, () => this.close());
        }
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.close();
            }
        });
    }
    addKeyboardSupport(element, callback) {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                callback();
            }
        });
    }
    open() {
        if (!this.modal || !this.viewer)
            return;
        this.modal.classList.add('active');
        document.body.classList.add('modal-open');
        const closeButton = DOMUtils.getElementById('closeModal');
        if (closeButton) {
            closeButton.focus();
        }
        if (!this.isLoaded) {
            this.loadPDF();
        }
    }
    close() {
        if (!this.modal)
            return;
        this.modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        const viewBtn = DOMUtils.getElementById('viewResumeBtn');
        if (viewBtn) {
            viewBtn.focus();
        }
    }
    async loadPDF() {
        if (!this.viewer)
            return;
        const modalBody = this.viewer.parentElement;
        if (!modalBody)
            return;
        this.resetModal();
        this.showLoading(modalBody);
        try {
            await this.tryDirectLoad();
        }
        catch (error) {
            try {
                await this.tryPDFjsLoad();
            }
            catch (error) {
                try {
                    await this.tryObjectEmbed();
                }
                catch (error) {
                    try {
                        await this.tryGoogleDocsViewer();
                    }
                    catch (error) {
                        this.showError();
                    }
                }
            }
        }
    }
    resetModal() {
        if (!this.viewer)
            return;
        const modalBody = this.viewer.parentElement;
        if (!modalBody)
            return;
        modalBody.classList.remove('loading');
        this.isLoaded = false;
        const existingElements = modalBody.querySelectorAll('.pdf-loading, .pdf-error, object, embed');
        existingElements.forEach(el => el.remove());
        this.viewer.style.display = 'block';
        this.viewer.src = '';
    }
    showLoading(modalBody) {
        modalBody.classList.add('loading');
        const loadingElement = document.createElement('div');
        loadingElement.className = 'pdf-loading';
        loadingElement.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading resume...</p>
        `;
        modalBody.appendChild(loadingElement);
    }
    hideLoading() {
        if (!this.viewer)
            return;
        const modalBody = this.viewer.parentElement;
        if (!modalBody)
            return;
        modalBody.classList.remove('loading');
        this.isLoaded = true;
        const loadingEl = modalBody.querySelector('.pdf-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
    }
    async tryDirectLoad() {
        return new Promise((resolve, reject) => {
            const response = fetch(this.pdfPath);
            response.then(res => {
                if (res.ok) {
                    this.viewer.src = this.pdfPath;
                    setTimeout(() => {
                        if (this.viewer.contentDocument || this.viewer.contentWindow) {
                            this.hideLoading();
                            resolve();
                        }
                        else {
                            reject(new Error('Direct load failed'));
                        }
                    }, 2000);
                }
                else {
                    reject(new Error('PDF not accessible'));
                }
            }).catch(() => reject(new Error('Fetch failed')));
        });
    }
    async tryPDFjsLoad() {
        return new Promise((resolve, reject) => {
            const viewerUrl = `${this.pdfPath}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`;
            this.viewer.src = viewerUrl;
            setTimeout(() => {
                if (this.viewer.parentElement?.classList.contains('loading')) {
                    reject(new Error('PDF.js load failed'));
                }
                else {
                    this.hideLoading();
                    resolve();
                }
            }, 2000);
        });
    }
    async tryObjectEmbed() {
        return new Promise((resolve, reject) => {
            if (!this.viewer)
                return reject(new Error('No viewer'));
            const modalBody = this.viewer.parentElement;
            if (!modalBody)
                return reject(new Error('No modal body'));
            const objectElement = document.createElement('object');
            objectElement.data = this.pdfPath;
            objectElement.type = 'application/pdf';
            objectElement.style.width = '100%';
            objectElement.style.height = '100%';
            objectElement.style.border = 'none';
            objectElement.innerHTML = `
                <embed src="${this.pdfPath}" type="application/pdf" width="100%" height="100%" />
                <p>Unable to display PDF. <a href="${this.pdfPath}" download="Abdullah_Ali_Resume.pdf">Download instead</a></p>
            `;
            this.viewer.style.display = 'none';
            modalBody.appendChild(objectElement);
            setTimeout(() => {
                if (modalBody.classList.contains('loading')) {
                    reject(new Error('Object embed failed'));
                }
                else {
                    this.hideLoading();
                    resolve();
                }
            }, 1000);
        });
    }
    async tryGoogleDocsViewer() {
        return new Promise((resolve, reject) => {
            const fullPdfUrl = `${window.location.origin}/${this.pdfPath}`;
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;
            this.viewer.src = googleViewerUrl;
            this.viewer.style.display = 'block';
            setTimeout(() => {
                if (this.viewer.parentElement?.classList.contains('loading')) {
                    reject(new Error('Google Docs viewer failed'));
                }
                else {
                    this.hideLoading();
                    resolve();
                }
            }, 3000);
        });
    }
    showError() {
        if (!this.viewer)
            return;
        const modalBody = this.viewer.parentElement;
        if (!modalBody)
            return;
        modalBody.classList.remove('loading');
        const loadingEl = modalBody.querySelector('.pdf-loading');
        if (loadingEl) {
            loadingEl.remove();
        }
        const existingError = modalBody.querySelector('.pdf-error');
        if (existingError) {
            existingError.remove();
        }
        const errorElement = document.createElement('div');
        errorElement.className = 'pdf-error';
        errorElement.innerHTML = `
            <div class="error-content">
                <h3>📄 PDF Viewer Not Available</h3>
                <p>Your browser doesn't support inline PDF viewing. Choose one of the options below:</p>
                <div class="error-actions">
                    <a href="${this.pdfPath}" download="Abdullah_Ali_Resume.pdf" class="btn btn-primary">
                        <span class="btn-icon">📄</span>
                        Download Resume
                    </a>
                    <a href="${this.pdfPath}" target="_blank" class="btn btn-secondary">
                        <span class="btn-icon">🔗</span>
                        Open in New Tab
                    </a>
                    <button class="btn btn-outline" onclick="window.location.reload()">
                        <span class="btn-icon">🔄</span>
                        Refresh Page
                    </button>
                </div>
                <div class="pdf-info">
                    <p><strong>Alternative:</strong> Copy this link and paste it in your browser:</p>
                    <code onclick="navigator.clipboard.writeText('${window.location.origin}/${this.pdfPath}')" style="cursor: pointer; padding: 0.5rem; background: #f0f0f0; border-radius: 4px; display: inline-block; margin-top: 0.5rem;">
                        ${window.location.origin}/${this.pdfPath}
                    </code>
                </div>
            </div>
        `;
        modalBody.appendChild(errorElement);
        this.viewer.style.display = 'none';
    }
}
