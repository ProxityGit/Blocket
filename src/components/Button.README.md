# Componente Button - Guía de Uso

## Descripción
Componente de botón reutilizable con el estilo de "Crear/Actualizar Bloque", que incluye gradientes, sombras y efectos hover.

## Instalación
```jsx
import Button from '../../components/Button';
import { Save, Plus, Trash2, Check } from 'lucide-react';
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'success'` | `'primary'` | Variante del botón |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño del botón |
| `disabled` | `boolean` | `false` | Si el botón está deshabilitado |
| `loading` | `boolean` | `false` | Muestra spinner de carga |
| `fullWidth` | `boolean` | `false` | Botón ocupa todo el ancho |
| `onClick` | `function` | - | Función al hacer clic |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo de botón HTML |
| `icon` | `ReactNode` | - | Icono a mostrar |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posición del icono |

## Ejemplos de Uso

### Botón Primary (Acción principal)
```jsx
<Button 
  variant="primary" 
  onClick={handleSave}
  icon={<Save />}
>
  Guardar Cambios
</Button>
```

### Botón Secondary (Acción secundaria)
```jsx
<Button 
  variant="secondary" 
  onClick={handleCancel}
  icon={<X />}
>
  Cancelar
</Button>
```

### Botón Danger (Acción destructiva)
```jsx
<Button 
  variant="danger" 
  onClick={handleDelete}
  icon={<Trash2 />}
>
  Eliminar
</Button>
```

### Botón Success (Confirmación)
```jsx
<Button 
  variant="success" 
  onClick={handleConfirm}
  icon={<Check />}
>
  Confirmar
</Button>
```

### Botón con Estado de Carga
```jsx
<Button 
  variant="primary" 
  loading={isSubmitting}
  disabled={isSubmitting}
  type="submit"
>
  Enviando...
</Button>
```

### Botón de Ancho Completo
```jsx
<Button 
  variant="primary" 
  fullWidth
  icon={<Plus />}
>
  Agregar Campo
</Button>
```

### Botón con Icono a la Derecha
```jsx
<Button 
  variant="primary" 
  icon={<ArrowRight />}
  iconPosition="right"
>
  Siguiente
</Button>
```

### Diferentes Tamaños
```jsx
<Button variant="primary" size="small">Pequeño</Button>
<Button variant="primary" size="medium">Mediano</Button>
<Button variant="primary" size="large">Grande</Button>
```

### Botón Deshabilitado
```jsx
<Button 
  variant="primary" 
  disabled
>
  No Disponible
</Button>
```

## Variantes de Color

### Primary (Azul-Morado)
- Gradiente: `#2563eb → #7c3aed`
- Uso: Acciones principales (guardar, crear, actualizar)

### Secondary (Gris)
- Color: `#f1f5f9`
- Uso: Acciones secundarias (cancelar, volver)

### Danger (Rojo)
- Gradiente: `#dc2626 → #b91c1c`
- Uso: Acciones destructivas (eliminar, rechazar)

### Success (Verde)
- Gradiente: `#16a34a → #15803d`
- Uso: Confirmaciones (aprobar, confirmar)

## Estilos Personalizados

Puedes agregar clases adicionales usando la prop `className`:

```jsx
<Button 
  variant="primary" 
  className="mi-clase-personalizada"
>
  Botón Personalizado
</Button>
```

## Accesibilidad

El componente incluye:
- Focus ring para navegación con teclado
- Estados disabled apropiados
- Soporte para screen readers
- Feedback visual en hover y active

## Notas

- Los iconos se redimensionan automáticamente según el tamaño del botón
- El estado `loading` desactiva automáticamente el botón
- Los gradientes tienen `!important` para evitar conflictos con Tailwind CSS
- Animaciones suaves con transiciones de 0.2s
