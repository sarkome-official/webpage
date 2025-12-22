---
title: Knowledge Graph Technology
description: Entendiendo la tecnología central de Sarkome basada en visualización 3D y análisis semántico.
---

Sarkome utiliza un **Knowledge Graph (KG)** de última generación para conectar datos biomédicos aislados y descubrir patrones terapéuticos ocultos. Esta tecnología permite transformar millones de documentos científicos en una red de conocimiento navegable, explicable y accionable.

## ¿Qué es un Knowledge Graph?

Un Knowledge Graph organiza la información en una estructura de red donde los conceptos no son solo texto, sino entidades conectadas con significado.

> "Conectar datos aislados para descubrir patrones ocultos."

La visualización 3D de Knowledge Graphs (grafos de conocimiento) es la representación gráfica de datos interconectados en un espacio tridimensional. A diferencia de los gráficos planos convencionales, esta técnica permite explorar redes extensas de información mediante tres dimensiones (X, Y, Z), aportando percepción de profundidad.

### Componentes Semánticos

1.  **Nodos (Entidades)**: Representan personas, genes, fármacos o conceptos biológicos. Se visualizan como esferas en el espacio 3D.
    *   *Ejemplo*: `Leonardo da Vinci`, `Gen TP53`, `Fármaco Cediranib`.
2.  **Aristas (Relaciones)**: Conectan los nodos y describen *cómo* se relacionan. Son líneas dirigidas que crean el "contexto".
    *   *Ejemplo*: `[PINTÓ]`, `[INHIBE]`, `[CAUSA]`.
3.  **Etiquetas Semánticas**: Clasifican los tipos de nodos ("Categoría") para darles un significado ontológico claro.
    *   *Ejemplo*: `[Artista]`, `[Proteína]`, `[Enfermedad]`.

## Visualización 3D: La Nueva Frontera

Para manejar la complejidad del cáncer, Sarkome implementa tecnologías de visualización inmersiva inspiradas en herramientas como [Neo4j 3D Force-Graph](https://neo4j.com/blog/developer/visualizing-graphs-in-3d-with-webgl/).

### ¿Por qué 3D?
*   **Volumen de Datos Masivo**: Permite visualizar millones de nodos sin la saturación visual típica de los gráficos 2D planos.
*   **Detección de Clusters**: Facilita ver agrupaciones naturales de fármacos o genes que trabajan en vías similares.
*   **Navegación Intuitiva**: Permite a los investigadores "viajar" a través de las vías metabólicas usando rotación, zoom y desplazamiento (pan/tilt).

## Beneficios para la Investigación Oncológica

*   **Descubrimiento de Patrones**: Facilita la detección de conexiones indirectas (ej. un fármaco que trata un síntoma que activa una vía genética opuesta).
*   **Contexto Semántico Explicable**: A diferencia de las "Cajas Negras" del Deep Learning, el KG muestra *por qué* se hace una predicción.
*   **Integración Multimodal**: Fusiona datos de ensayos clínicos (ClinicalTrials.gov), literatura (PubMed) y bases de datos genómicas (Uniprot) en un solo "cerebro" unificado.

## Stack Tecnológico

Sarkome Refinery utiliza un stack moderno para renderizar estas estructuras en el navegador:

*   **Three.js / WebGL**: Motor gráfico para renderizado de alto rendimiento acelerado por GPU.
*   **React-Force-Graph**: Algoritmos de física para la distribución orgánica de nodos.
*   **Neo4j**: Base de datos de grafos nativa para consultas ultra-rápidas mediante Cypher.