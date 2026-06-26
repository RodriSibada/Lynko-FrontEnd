// ============================================
// PASSWORD-VALIDATOR.JS
// Validación de contraseña en tiempo real
// Requisitos:
// 1. Mínimo 8 caracteres
// 2. Al menos una letra mayúscula
// 3. Al menos una letra minúscula
// 4. Al menos un número
// ============================================

class PasswordValidator {
    constructor(inputSelector, containerSelector = null) {
        this.input = document.querySelector(inputSelector);
        this.container = containerSelector ? document.querySelector(containerSelector) : null;
        
        if (!this.input) {
            console.error(`Password input not found: ${inputSelector}`);
            return;
        }
        
        this.init();
    }

    init() {
        // Crear elemento de validación si no existe el contenedor
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'password-strength';
            this.input.parentElement.insertBefore(this.container, this.input.nextSibling);
        }

        // Agregar listeners
        this.input.addEventListener('input', () => this.validate());
        this.input.addEventListener('focus', () => this.showValidation());
        this.input.addEventListener('blur', () => this.hideValidation());

        // Renderizar validación inicial
        this.renderValidation();
    }

    // ===== REQUISITOS DE VALIDACIÓN =====
    hasMinLength(password) {
        return password.length >= 8;
    }

    hasUppercase(password) {
        return /[A-Z]/.test(password);
    }

    hasLowercase(password) {
        return /[a-z]/.test(password);
    }

    hasNumber(password) {
        return /\d/.test(password);
    }

    // ===== CÁLCULO DE FORTALEZA =====
    getStrength(password) {
        const checks = [
            this.hasMinLength(password),
            this.hasUppercase(password),
            this.hasLowercase(password),
            this.hasNumber(password)
        ];

        const passedChecks = checks.filter(check => check).length;

        if (passedChecks <= 2) return 'weak';      // 1-2 requisitos
        if (passedChecks === 3) return 'medium';   // 3 requisitos
        return 'strong';                            // 4 requisitos
    }

    // ===== RENDERIZAR VALIDACIÓN =====
    renderValidation() {
        const password = this.input.value;
        const strength = this.getStrength(password);

        this.container.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill ${strength}"></div>
            </div>
            <p style="font-weight: 700; margin: var(--spacing-sm) 0;">
                Fortaleza: <span class="strength-text">${this.getStrengthText(strength)}</span>
            </p>
            <ul class="requirements">
                <li class="${this.hasMinLength(password) ? 'met' : ''}">
                    Mínimo 8 caracteres
                </li>
                <li class="${this.hasUppercase(password) ? 'met' : ''}">
                    Al menos una letra mayúscula (A-Z)
                </li>
                <li class="${this.hasLowercase(password) ? 'met' : ''}">
                    Al menos una letra minúscula (a-z)
                </li>
                <li class="${this.hasNumber(password) ? 'met' : ''}">
                    Al menos un número (0-9)
                </li>
            </ul>
        `;
    }

    getStrengthText(strength) {
        const texts = {
            weak: '❌ Débil',
            medium: '⚠️ Media',
            strong: '✓ Fuerte'
        };
        return texts[strength] || 'Débil';
    }

    showValidation() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }

    hideValidation() {
        // Opcionalmente ocultar cuando pierde foco
        // Descomentar si lo prefieres
        // if (this.container) {
        //     this.container.style.display = 'none';
        // }
    }

    // ===== VALIDAR Y DEVOLVER RESULTADO =====
    validate() {
        const password = this.input.value;
        this.renderValidation();

        return {
            isValid: this.isValid(password),
            strength: this.getStrength(password),
            password: password
        };
    }

    isValid(password = this.input.value) {
        return (
            this.hasMinLength(password) &&
            this.hasUppercase(password) &&
            this.hasLowercase(password) &&
            this.hasNumber(password)
        );
    }

    // ===== OBTENER CONTRASEÑA VALIDADA =====
    getPassword() {
        if (this.isValid()) {
            return this.input.value;
        } else {
            this.input.focus();
            this.showValidation();
            throw new Error('La contraseña no cumple los requisitos');
        }
    }
}

// ============================================
// INICIALIZAR VALIDADORES EN PÁGINAS
// ============================================

// Cuando el DOM está listo, inicializar validadores
document.addEventListener('DOMContentLoaded', () => {
    // En registro.html
    const passwordInputRegistro = document.querySelector('input[name="contrasena"]');
    if (passwordInputRegistro && passwordInputRegistro.form?.action.includes('registro')) {
        new PasswordValidator('input[name="contrasena"]');
    }

    // En login.html (opcional)
    const passwordInputLogin = document.querySelector('input[name="contrasena"]');
    if (passwordInputLogin && passwordInputLogin.form?.action.includes('login')) {
        new PasswordValidator('input[name="contrasena"]');
    }

    // En Perfil.html (cambiar contraseña)
    const passwordInputPerfil = document.querySelector('input[type="password"]');
    if (passwordInputPerfil && window.location.pathname.includes('Perfil')) {
        new PasswordValidator('input[type="password"]');
    }
});

// ============================================
// VALIDACIÓN EN SUBMIT DE FORMULARIO
// ============================================

function validatePasswordOnSubmit(event, passwordInputSelector) {
    event.preventDefault();

    const form = event.target;
    const passwordInput = form.querySelector(passwordInputSelector);

    if (!passwordInput) {
        console.error(`Password input not found: ${passwordInputSelector}`);
        return false;
    }

    const password = passwordInput.value;

    // Crear validador temporal
    const validator = new PasswordValidator(passwordInputSelector);

    if (!validator.isValid(password)) {
        alert('⚠️ La contraseña debe cumplir todos los requisitos:\n\n✓ Mínimo 8 caracteres\n✓ Una letra mayúscula\n✓ Una letra minúscula\n✓ Un número');
        passwordInput.focus();
        return false;
    }

    // Si llegamos aquí, la contraseña es válida
    form.submit();
}

// ============================================
// EXPORTAR PARA USO EN OTROS MÓDULOS
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordValidator;
}
