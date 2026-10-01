# ci-delta-test

Un repositorio temporal para probar de punta a punta las integraciones de CI de GitHub.

## Cómo funciona CI

El workflow en [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta
cada vez que se hace push de una rama. Cinco jobs independientes crean cinco
checks separados en GitHub:

| Check | Trabajo simulado |
| --- | --- |
| Lint | 10 segundos |
| Verificación de tipos | 20 segundos |
| Tests unitarios | 30 segundos |
| Tests de integración | 40 segundos |
| Compilación | 50 segundos |

Los jobs pueden ejecutarse en paralelo y terminar en distintos momentos, lo que
facilita observar los cambios de estado. El inicio de los runners y la espera en
la cola pueden llevar un rato. Cada job tiene un límite de dos minutos.

Estos checks son de prueba: simplemente muestran mensajes y esperan antes de
terminar correctamente. No analizan el código. No se necesitan aplicaciones,
dependencias ni secretos.

Seguí las ejecuciones en la pestaña **Actions** del repositorio. GitHub Actions
informa las ejecuciones de los checks, no el estado anterior de los commits. El
workflow usa únicamente el evento `push`, así que abrir un pull request no
inicia otra ejecución.

## Creá una rama, hacé push, esperá a CI y mergeá

Partí de la versión más reciente de `main` para que tu rama incluya el workflow:

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

Un commit vacío alcanza para ejecutar una prueba; también podés incluir cambios
reales en archivos. Abrí un pull request de tu rama hacia `main`, revisá los
cinco checks y mergealo cuando todos hayan terminado correctamente. Hacer push
del merge a `main` también inicia CI.

El merge sigue siendo manual. Para evitar mergear antes de que CI termine
correctamente, configurá una regla de protección de ramas o un ruleset de GitHub
para `main` que exija estos cinco checks. El workflow por sí solo no impone esta
restricción.

### Ramas existentes sin el workflow

En tu rama de feature, incorporá la configuración de `main`:

```sh
git fetch origin
git merge origin/main
git push
```

Los checks corresponden a un commit específico. Al agregar el workflow, los
checks se ejecutan sobre el commit que acabás de subir; no se agregan checks a
commits anteriores.

## Iniciá otra ejecución

En una rama que ya subiste y que contiene el workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Probá un fallo

En uno de los jobs, reemplazá el paso simulado por:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Hacé commit y push del cambio para obtener un check fallido. Después restaurá
el paso exitoso y volvé a hacer push para obtener un check aprobado. Los demás
jobs siguen siendo independientes y pueden terminar correctamente.

## Un experimento sencillo

Este repositorio es intencionalmente sencillo: hacé un pequeño cambio, creá un
commit y subilo para ver el ciclo completo de feedback:

1. Tu rama recibe un commit.
2. GitHub Actions inicia cinco checks independientes.
3. Los checks terminan según sus propios tiempos.
4. El pull request muestra el resultado combinado.

Así tenés un lugar práctico para experimentar con ramas, commits, pull
requests y CI sin tener que configurar una aplicación primero.

### Prueba rápida

Si solo estás probando la conexión con el repositorio, con agregar una nota
breve como esta alcanza para generar un diff real sin cambiar el comportamiento
de CI.

> Nota de prueba: esta línea se agregó como un cambio inocuo al README.

> Otra nota de prueba rápida.

> Un cambio pequeño más para probar el flujo de edición.

> Otra prueba: el README sigue siendo fácil de editar.
