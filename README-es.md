
[English](README.md) | [日本語](README-jp.md) | [العربية](README-ar.md) | [Português](README-pt.md) | [Español](README-es.md)

# Mini Programa Empresarial de Shenzhen

## Descripción general
Este es un mini programa empresarial multiplataforma construido con **UniApp** para negocios en Shenzhen. Cuenta con gestión de actividades, sistemas de pago, flujos de autenticación y capacidades para compartir contenido. La base de código demuestra prácticas modernas de Vue.js con extensiones UniApp.

## Características clave y componentes

### 1. Gestión de actividades (`activity.vue`)
```vue
<u-count-down :timestamp="invite_info.times" separator="zh"></u-count-down>
<button open-type="share">Continuar compartiendo</button>
````

* **Campañas de sobres rojos**: actividades de recompensa por tiempo limitado con temporizadores regresivos
* **Sistema de invitación**: seguimiento de usuarios invitados y umbrales de recompensa
* **Compartir en WeChat**: funcionalidad nativa para compartir con rutas personalizadas
* **Diseño responsivo**: cálculo dinámico de la altura para barras de navegación

### 2. Sistema de pagos (`pay.vue`)

```vue
<u-radio-group v-model="payType">
  <u-radio name="1">Pago WeChat</u-radio>
  <u-radio name="2">Deducción con vale</u-radio>
</u-radio-group>
<button @click="pay()">Pagar ahora</button>
```

* **Dos métodos de pago**:

  * Integración con WeChat Pay
  * Sistema de redención de vales/puntos
* **Transacciones seguras**: API de pago envuelta con autenticación de token
* **Integración de anuncios**: anuncios intersticiales tras pagos exitosos

### 3. Autenticación empresarial (`auth.vue`)

```vue
<input name="name" placeholder="Nombre de la empresa">
<button @click="upload(1)">Subir licencia comercial</button>
```

* **Verificación empresarial**:

  * Registro del nombre de la empresa
  * Subida de licencia comercial
  * Validación de identificación del representante legal
* **Manejo de imágenes**: vista previa de subida y gestión de permisos

### 4. Gestión de contenido (`article.vue`)

```vue
<rich-text :nodes="info.content"></rich-text>
<button @click="downLoad(v.file)">Descargar archivo adjunto</button>
```

* **Visualización de texto enriquecido**: renderizado seguro de contenido HTML
* **Gestión de archivos**:

  * Vista previa de imágenes con zoom
  * Descargas seguras con verificación de permisos
* **Sistema de comentarios**: hilos anidados con etiquetado de usuarios

### 5. Plantillas de acuerdos (`agreement.vue`)

```vue
<u-parse :html="content"></u-parse>
```

* **Carga dinámica de contenido**: obtención de acuerdos desde el backend
* **Soporte para plantillas dobles**:

  * Acuerdos de usuario
  * Contratos de asociación

### 6. Sistema de facturación (`bill/detail.vue`)

```vue
<view v-if="bill.status == 1">Estado: No pagado</view>
<button @click="viewPayType">Pagar ahora</button>
```

* **Seguimiento del estado de pago**: actualizaciones en tiempo real del estado de factura
* **Interfaz unificada de pago**: componente de pago reutilizable
* **Cálculos de vales**: conversión dinámica de puntos a efectivo

## Destacados técnicos

### Tecnologías centrales

* **Framework UniApp**: desarrollo multiplataforma
* **Composición Vue.js**: gestión reactiva de datos
* **uView UI**: biblioteca de componentes consistente
* **APIs de WeChat Mini Program**: integración de funcionalidades nativas

### Prácticas de seguridad

```javascript
// Ejemplo de validación de token
app.isLogin().then(() => {
  app.checkLogin2();
  that.getUser();
});
```

* Validación de token API para operaciones sensibles
* Gestión de permisos del álbum de fotos
* Transmisión segura de parámetros de pago

### Optimización del rendimiento

* Carga de imágenes bajo demanda
* Sistema de paginación de comentarios
* Renderizado de contenido basado en WebView (`detail.vue`)
* Carga diferida de anuncios con manejo de errores

## Escenarios de uso

1. **Campañas de marketing**: promociones temporales con incentivos para compartir
2. **Contenido pagado**: monetización de artículos/videos con opciones flexibles de pago
3. **Autenticación B2B**: incorporación de socios empresariales con verificación
4. **Gestión financiera**: seguimiento y pago de facturas dentro del mini programa
5. **Compartición de recursos**: distribución segura de documentos empresariales

> **Nota**: Este mini programa se integra con las funcionalidades del ecosistema WeChat, incluyendo inicio de sesión, pago y compartir, manteniendo estándares de seguridad de nivel empresarial.


