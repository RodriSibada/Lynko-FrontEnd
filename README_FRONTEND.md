Lynko Frontend - README


---

## 📁 Estructura del Proyecto

```
Pages/
├── login.html           # 🔐 Pantalla de inicio de sesión
├── login.css            # Estilos login
├── registro.html        # ✍️ Formulario de registro
├── registro.css         # Estilos registro
│
├── inicio_lynko.html    # 🏠 Dashboard principal (estudiante autenticado)
├── styles.css           # Estilos globales (variables CSS, sidebar, header, etc.)
│
├── Materias.html        # 📖 Galería de materias (Matemáticas, Español, Biología)
├── materias.css         # Estilos específicos materias
│
├── Actividades.html     # ✏️ Lista de actividades/retos disponibles
│
├── Progreso.html        # 📈 Dashboard de progreso del usuario
├── progreso.css         # Estilos progreso
│
├── Recompensas.html     # 🏆 Vitrina de trofeos y medallas
├── recompensa.css       # Estilos recompensas
│
├── Perfil.html          # 👤 Mi perfil + Editor de avatar
├── perfil.css           # Estilos perfil
│
├── Ajustes.html         # ⚙️ Configuración (sonido, notificaciones, etc.)
│
├── Admin.html           # 🛠️ Panel de administración
├── adim.css             # Estilos admin
│
└── dashboard-auth-helper.js  # 🔑 Helper de autenticación reutilizable
```

---

## 🔑 Flujo de Autenticación

### **1. Registro**

```
Usuario → Formulario (registro.html)
         ↓
    Envía: POST /registro
         ↓
    Backend valida email + crea usuario
         ↓
    Redirige: /inicio-estudiante/{id}
         ↓
    ✅ Usuario logueado en dashboard
```

**Datos guardados en `localStorage`:**
```javascript
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "Sofía",
    "email": "sofia@lynko.app",
    "xp": 0,
    "level": 1
  }
}
```

### **2. Login**

```
Usuario → Formulario (login.html)
         ↓
    Envía: POST /login
         ↓
    Backend valida credenciales
         ↓
    Si "admin" → Redirige /admin
    Si "estudiante" → Redirige /inicio-estudiante/{id}
         ↓
    ✅ Almacena token en localStorage
```

### **3. Acceso a Rutas Protegidas**

```javascript
// En cada página (inicio_lynko.html, Materias.html, etc.)
document.addEventListener("DOMContentLoaded", () => {
    // dashboard-auth-helper.js valida:
    LynkoAuth.checkAuth();  // ¿Token en localStorage?
                            // NO → Redirige a login.html
                            // SÍ → Carga dashboard
});
```

---

## 📄 Páginas Detalladas

### **🔐 login.html**

**Propósito**: Autenticar estudiantes y administradores

**Campos**:
- Email
- Contraseña

**Flujo**:
1. Usuario ingresa email + contraseña
2. Backend valida en tabla `usuarios`
3. Si rol = "admin" → `/admin`
4. Si rol = "estudiante" → `/inicio-estudiante/{id_usuario}`

**Variables de plantilla**:
```html
{% if error %}
    <p>{{ error }}</p>  <!-- Ej: "Credenciales incorrectas" -->
{% endif %}
```

---

### **✍️ registro.html**

**Propósito**: Registrar nuevos estudiantes

**Campos**:
- Nombre completo
- Email (único)
- Contraseña

**Flujo**:
1. Usuario completa formulario
2. Backend: `INSERT INTO usuarios (nombre, correo, contraseña, rol='estudiante', puntaje_total=0)`
3. Nuevo ID → `/inicio-estudiante/{nuevo_id}`
4. Se da medalla de bienvenida automáticamente

**Variables de plantilla**:
```html
{% if error %}
    <p style="color: #D32F2F;">{{ error }}</p>
    <!-- Ej: "El correo ya está registrado" -->
{% endif %}
```

---

### **🏠 inicio_lynko.html (DASHBOARD PRINCIPAL)**

**Propósito**: Hub central del estudiante autenticado

**Secciones**:
1. **Header Top**: Nombre usuario + Nivel + XP + Notificaciones
2. **Sidebar**: Logo + Navegación + Racha de estudio 🔥
3. **Mascot Card**: Lynko (personaje) con diálogo motivacional
4. **Subject Cards**: 3 materias con progreso (Matemáticas, Español, Biología)
5. **Bottom Grid**:
   - Mi Progreso (circular progress + estadísticas)
   - Recompensas Recientes
   - Actividad Recomendada
6. **Bottom Banner**: Call-to-action "Ir a actividades"

**Variables de plantilla**:
```html
<!-- Nombre y puntos dinámicos -->
<h1>¡Hola, {{ nombre }}! 👋</h1>
<div class="points-badge">⭐ {{ puntos }} <span>puntos</span></div>

<!-- Enlace dinámico al dashboard -->
<a href="/inicio-estudiante/{{ id_usuario }}">
```

**Estilos clave** (en `styles.css`):
```css
:root {
    --orange-primary: #FF7A00;
    --orange-dark: #E66E00;
    --orange-light: #FFF0E0;
    --bg-main: #FDF9F5;
    --text-dark: #333333;
    --text-muted: #666666;
    --card-bg: #FFFFFF;
    --border-radius: 20px;
}

.sidebar {
    width: 280px;
    background: linear-gradient(135deg, var(--orange-primary), var(--orange-dark));
    position: fixed;
    height: 100vh;
}

.main-content {
    margin-left: 280px;
    padding: 30px;
}

.subject-card {
    background: white;
    border-radius: var(--border-radius);
    padding: 20px;
    border: 1px solid #F0F0F0;
}

.progress-bar-container {
    height: 8px;
    background: #E0E0E0;
    border-radius: 10px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--orange-primary);
    transition: width 0.3s ease;
}
```

---

### **📖 Materias.html**

**Propósito**: Mostrar las 3 materias principales

**Estructura**:
```html
<div class="subjects-grid">
    <!-- Matemáticas -->
    <div class="subject-card">
        <div class="subject-banner math-bg">➗</div>
        <h3>Matemáticas</h3>
        <p>Números, operaciones y problemas</p>
        <progress>75%</progress>
        <span>12 de 16 Lecciones</span>
        <button>Continuar</button>
    </div>
    
    <!-- Español -->
    <div class="subject-card">
        <div class="subject-banner spanish-bg">📖</div>
        <!-- Similar a Matemáticas -->
    </div>
    
    <!-- Biología -->
    <div class="subject-card">
        <div class="subject-banner bio-bg">🧪</div>
        <!-- Similar a Matemáticas -->
    </div>
</div>
```

**Colores por materia** (en `styles.css`):
```css
.math-bg { background: linear-gradient(135deg, #FF9F00, #FF7A00); }
.spanish-bg { background: linear-gradient(135deg, #4CAF50, #45a049); }
.bio-bg { background: linear-gradient(135deg, #7E57C2, #6A4C93); }
```

---

### **✏️ Actividades.html**

**Propósito**: Retos disponibles para el estudiante

**Estructura de cada actividad**:
```html
<div class="activity-card">
    <div class="activity-header math-bg">
        <span>➕ Matemáticas</span>
        <span class="status-badge status-available">Disponible</span>
        <!-- O: status-completed, status-locked -->
    </div>
    <div class="activity-body">
        <h3>Suma divertida</h3>
        <p>Practica operaciones...</p>
        <div class="activity-meta">
            <span>💎 +15 Puntos</span>
            <span>⏱️ 5 min</span>
        </div>
        <button class="btn-primary">¡Empezar reto!</button>
    </div>
</div>
```

**Estados**:
- `status-available` → Verde, botón habilitado
- `status-completed` → Gris, botón "Repasar"
- `status-locked` → Opacidad 0.7, botón deshabilitado 🔒

---

### **📈 Progreso.html**

**Propósito**: Dashboard de estadísticas personales

**Secciones**:
1. **Resumen de Cuenta**:
   - Progreso circular (60%)
   - Materias Completas: 3/3
   - Ejercicios Perfectos: 12
   - Tiempo Total: 4h 30m
   - Días Activos: 7 días seguidos

2. **Desempeño por Materia**:
   - Matemáticas 75% (Excelente)
   - Español 60% (Bueno)
   - Biología 40% (En progreso)

---

### **🏆 Recompensas.html**

**Propósito**: Vitrina de trofeos y medallas

**Estructura de medalla**:
```html
<div class="badge-box">
    <div class="badge-icon-circle">⭐</div>
    <h4>Genio Matemático</h4>
    <p>Completaste 10 ejercicios perfectamente.</p>
</div>

<!-- Desbloqueadas vs Bloqueadas -->
<div class="badge-box locked">
    <div class="badge-icon-circle">🔒</div>
    <h4>Imparable</h4>
    <p>Alcanza una racha de estudio de 15 días.</p>
</div>
```

---

### **👤 Perfil.html**

**Propósito**: Editar datos personales y crear avatar personalizado

**Secciones**:
1. **Info Personal**:
   - Avatar grande (140px)
   - Nombre editable
   - Email (solo lectura)
   - Contraseña

2. **Creador de Avatar**:
   - Tabs: "Tono de piel" | "Cabello" | "Ojos" | "Ropa"
   - Grid de opciones (colores, estilos)
   - Emojis seleccionables
   - Botón "Restablecer avatar"

---

### **⚙️ Ajustes.html**

**Propósito**: Configuración de la plataforma

**Opciones**:
1. Música de fondo (toggle)
2. Efectos de sonido (toggle)
3. Notificaciones en pantalla (toggle)
4. Botón "Guardar Cambios"

---

### **🛠️ Admin.html**

**Propósito**: Panel administrativo (solo para rol = "admin")

**Secciones**:
1. **Rendimiento por Asignatura**:
   - Tabla: Asignatura | Intentos | Promedio | Estudiantes Aprobados

2. **Registrar Pregunta**:
   - Formulario: Enunciado | Materia | Dificultad | Puntos | 3 opciones | Respuesta correcta

3. **Historial de Exámenes**:
   - Tabla: Estudiante | Evaluación | Materia | Calificación

4. **Banco de Preguntas**:
   - Tabla: ID | Enunciado | Área | Complejidad | Botón Eliminar

5. **Control de Alumnos**:
   - Tabla: ID | Nombre | Email | XP | Medallas | Botón Baja

---

## 🔐 dashboard-auth-helper.js

**Propósito**: Helper reutilizable para todas las páginas protegidas

### **Clase `LynkoAuth`**

```javascript
class LynkoAuth {
    // ✅ Obtener token del localStorage
    static getToken()
    
    // ✅ Obtener datos del usuario del localStorage
    static getUser()
    
    // ✅ Verificar si está autenticado
    static isAuthenticated()
    
    // ✅ Obtener usuario actual de la API
    static async getCurrentUser()
    
    // ✅ Cerrar sesión
    static logout()
    
    // ✅ Proteger ruta (redirige a login si no auth)
    static checkAuth()
    
    // ✅ Actualizar elementos HTML con datos usuario
    static updateDashboard()
    
    // ✅ Hacer request autenticado
    static async authenticatedFetch(url, options)
}
```

### **Uso en página protegida**

```html
<!DOCTYPE html>
<html>
<head>
    <script src="dashboard-auth-helper.js"></script>
</head>
<body>
    <h1>Hola, <span id="userName">Usuario</span>!</h1>
    <span>Nivel: <span id="userLevel">1</span></span>
    <span>XP: <span id="userXP">0</span></span>
    <button id="logoutBtn">Cerrar sesión</button>
    
    <script>
    document.addEventListener("DOMContentLoaded", () => {
        // 1. Verificar que está logueado
        LynkoAuth.checkAuth();
        
        // 2. Cargar datos del usuario
        LynkoAuth.updateDashboard();
        
        // 3. Cerrar sesión
        document.getElementById("logoutBtn").addEventListener("click", () => {
            LynkoAuth.logout();
        });
    });
    </script>
</body>
</html>
```

### **Ejemplo: Hacer request protegido**

```javascript
// Obtener materias con token
async function loadSubjects() {
    const response = await LynkoAuth.authenticatedFetch(
        "http://localhost:8000/api/content/subjects",
        { method: "GET" }
    );
    
    if (response.ok) {
        const subjects = await response.json();
        console.log("Materias:", subjects);
        renderSubjects(subjects);
    }
}

// Actualizar XP del usuario
async function addXP(amount) {
    const response = await LynkoAuth.authenticatedFetch(
        "http://localhost:8000/api/users/xp",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ xp_amount: amount })
        }
    );
    
    if (response.ok) {
        LynkoAuth.updateDashboard();  // Actualizar UI
    }
}
```

---

## 🎨 Sistema de Colores

**Definido en `styles.css`** (variables CSS):

```css
:root {
    /* Naranja Lynko */
    --orange-primary: #FF7A00;      /* Botones, acciones */
    --orange-dark: #E66E00;         /* Hover, énfasis */
    --orange-light: #FFF0E0;        /* Fondos suaves */
    
    /* Fondos */
    --bg-main: #FDF9F5;             /* Fondo principal */
    --card-bg: #FFFFFF;             /* Tarjetas */
    
    /* Texto */
    --text-dark: #333333;           /* Texto principal */
    --text-muted: #666666;          /* Texto secundario */
    
    /* Otros */
    --border-radius: 20px;
}

/* Colores por materia */
.math-bg { background: linear-gradient(135deg, #FF9F00, #FF7A00); }
.spanish-bg { background: linear-gradient(135deg, #4CAF50, #45a049); }
.bio-bg { background: linear-gradient(135deg, #7E57C2, #6A4C93); }
```

---

## 📱 Responsive Design

**Breakpoints** (agregar a `styles.css`):

```css
/* Tablet (768px) */
@media (max-width: 768px) {
    .sidebar { width: 200px; }
    .main-content { margin-left: 200px; }
    .subjects-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
}

/* Mobile (480px) */
@media (max-width: 480px) {
    .sidebar { position: fixed; transform: translateX(-100%); }
    .main-content { margin-left: 0; }
    .header-top { flex-direction: column; }
}
```

---

## 🚀 Servir Frontend en Desarrollo

### **Opción 1: Con Python (Simple)**

```bash
# En la carpeta Pages/
python -m http.server 3000

# Accede a http://localhost:3000/login.html
```

### **Opción 2: Con Live Server en VS Code**

1. Instala extensión "Live Server"
2. Click derecho en `login.html` → "Open with Live Server"

### **Opción 3: Integrado en FastAPI**

```python
# En Main.py
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="Pages"), name="static")

# Accede a http://localhost:8000/static/login.html
```

---

## ✅ Checklist Frontend

- [ ] Todas las páginas HTML usan `styles.css` globales
- [ ] Cada página tiene su CSS específico (`login.css`, etc.)
- [ ] `dashboard-auth-helper.js` está en Pages/
- [ ] Todas las rutas internas usan rutas relativas
- [ ] Los formularios POST van a `/login` y `/registro`
- [ ] Los links de navegación apuntan a `.html` correctamente
- [ ] El logo y emojis se muestran correctamente
- [ ] Responsive funciona en móvil (480px)
- [ ] Token + usuario se guardan en localStorage después de login
- [ ] Cerrar sesión limpia localStorage y redirige a login.html

---

## 👥 Guía por Desarrollador

**Rodrigo** (Líder):
- Supervisar estructura CSS global
- Definir variables y paleta de colores
- Validar responsive design

**Simón**:
- Desarrollar páginas: Actividades, Admin
- Implementar formularios

**María**:
- Desarrollar páginas: Materias, Progreso, Recompensas
- Integrar CSS por página

**Montserrat**:
- Desarrollar páginas: Login, Registro, Perfil, Ajustes
- Revisar y mejorar dashboard-auth-helper.js
- Conectar con endpoints backend

---

## 🔗 Links Útiles

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Nunito Font](https://fonts.google.com/specimen/Nunito)

---

## 🎓 Ejemplo Completo: Login → Dashboard → Logout

### **1. Usuario en login.html**
```html
<!-- login.html -->
<form action="/login" method="POST">
    <input type="email" name="correo" placeholder="email@example.com">
    <input type="password" name="contrasena" placeholder="password">
    <button type="submit">Ingresar</button>
</form>
```

### **2. Backend procesa y redirige**
```python
# main.py
@app.post("/login")
def procesar_login(correo: str = Form(...), contrasena: str = Form(...)):
    # Validar credenciales
    if user:
        return RedirectResponse(url=f"/inicio-estudiante/{user.id}", status_code=303)
```

### **3. Frontend en inicio_lynko.html**
```html
<!-- inicio_lynko.html (template con Jinja2) -->
<script src="dashboard-auth-helper.js"></script>
<h1>¡Hola, {{ nombre }}! 👋</h1>
<p>⭐ {{ puntos }} puntos</p>

<script>
document.addEventListener("DOMContentLoaded", () => {
    LynkoAuth.checkAuth();      // Verifica token
    LynkoAuth.updateDashboard(); // Carga nombre + XP
});
</script>

<button id="logoutBtn">Cerrar sesión</button>
```

### **4. Usuario hace click en Logout**
```javascript
// dashboard-auth-helper.js
document.getElementById("logoutBtn").addEventListener("click", () => {
    LynkoAuth.logout();  // Limpia localStorage + redirige a login.html
});
```

---


