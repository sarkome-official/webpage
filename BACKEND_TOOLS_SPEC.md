# Sarkome Backend Tools Specification
## Guía de Implementación para el Agente LangChain/LangGraph

> **Versión:** 1.0.0  
> **Última actualización:** 5 de Enero, 2026  
> **Autor:** Sarkome Engineering Team

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Payload del Frontend](#payload-del-frontend)
4. [Herramientas Disponibles](#herramientas-disponibles)
5. [Implementación en LangChain](#implementación-en-langchain)
6. [Knowledge Graph API](#knowledge-graph-api)
7. [Flujo de Ejecución](#flujo-de-ejecución)
8. [Manejo de Errores](#manejo-de-errores)
9. [Ejemplos Completos](#ejemplos-completos)

---

## 🎯 Resumen Ejecutivo

El frontend de Sarkome permite a los usuarios **seleccionar dinámicamente** qué herramientas debe usar el agente AI para cada consulta. Esto permite consultas altamente personalizadas donde el usuario puede:

- Activar/desactivar fuentes de datos (Web Search, PrimeKG, AlphaFold)
- Seleccionar endpoints específicos del Knowledge Graph
- Combinar múltiples herramientas para análisis complejos

**El backend DEBE:**
1. Recibir la configuración de herramientas en el payload
2. Registrar SOLO las herramientas activas para esa ejecución
3. Ejecutar el agente con las herramientas filtradas
4. Retornar resultados en formato streaming (SSE)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SARKOME FRONTEND                                │
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │   InputForm.tsx  │    │ ChatInterface.tsx│    │   useAgent.ts    │       │
│  │                  │    │                  │    │                  │       │
│  │ • Effort Level   │───▶│ • Builds payload │───▶│ • POST /runs/    │       │
│  │ • Model Config   │    │ • Adds context   │    │   stream         │       │
│  │ • Tools Selection│    │ • Manages state  │    │ • Handles SSE    │       │
│  └──────────────────┘    └──────────────────┘    └────────┬─────────┘       │
│                                                           │                  │
└───────────────────────────────────────────────────────────┼──────────────────┘
                                                            │
                                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LANGGRAPH BACKEND                                  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        POST /runs/stream                              │   │
│  │                                                                       │   │
│  │  1. Parse incoming payload                                            │   │
│  │  2. Extract tools[] array                                             │   │
│  │  3. Filter/register only active tools                                 │   │
│  │  4. Build agent with dynamic tool list                                │   │
│  │  5. Execute with streaming response                                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Web Search  │  │  PrimeKG    │  │  AlphaFold  │  │  Patient Context    │ │
│  │    Tool     │  │   Tools     │  │    Tool     │  │      Tool           │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                          │                                                   │
│                          ▼                                                   │
│         ┌────────────────────────────────────────┐                          │
│         │         PRIMEKG API SERVER             │                          │
│         │         (FastAPI @ :8000)              │                          │
│         │                                        │                          │
│         │  /search/text      /search/semantic    │                          │
│         │  /neighbors/{node} /path/{src}/{tgt}   │                          │
│         │  /subgraph/{entity}                    │                          │
│         │  /hypothesis/repurposing/{disease}     │                          │
│         │  /hypothesis/targets/{disease}         │                          │
│         │  /hypothesis/combinations/{drug}       │                          │
│         │  /hypothesis/mechanisms/{drug}/{dis}   │                          │
│         └────────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Payload del Frontend

### Endpoint
```
POST /runs/stream
Content-Type: application/json
```

### Estructura Completa del Payload

```jsonc
{
  // ID del asistente (siempre "agent" para Sarkome)
  "assistant_id": "agent",
  
  // Input principal con mensajes y configuración
  "input": {
    // Array de mensajes en formato LangChain
    "messages": [
      {
        "role": "system",
        "content": "Contexto del paciente... (opcional)"
      },
      {
        "role": "user", 
        "content": "¿Qué opciones de tratamiento hay para leiomiosarcoma con mutación TP53?"
      }
    ],
    
    // Modelo para razonamiento/respuesta final
    "reasoning_model": "gemini-3-pro-preview",
    
    // Modelo para reflexión/queries
    "reflection_model": "gemini-3-flash-preview",
    
    // ID único de esta ejecución (para tracking)
    "client_run_id": "client_1736089234567_a1b2c3"
  },
  
  // Configuración del agente
  "config": {
    "assistant_id": "agent",
    "configurable": {
      "thread_id": "thread_abc123",
      "assistant_id": "agent",
      "client_run_id": "client_1736089234567_a1b2c3"
    },
    
    // ═══════════════════════════════════════════════════════════════
    // CONFIGURACIÓN DE HERRAMIENTAS (LO QUE DEBES LEER)
    // ═══════════════════════════════════════════════════════════════
    
    // Número de queries de búsqueda iniciales
    "initial_search_query_count": 3,
    
    // Máximo de loops de investigación
    "max_research_loops": 3,
    
    // ─────────────────────────────────────────────────────────────────
    // FLAGS DE HERRAMIENTAS PRIMARIAS (boolean)
    // ─────────────────────────────────────────────────────────────────
    "enable_web_search": true,      // Activar búsqueda web
    "enable_kg": true,              // Activar PrimeKG
    "enable_alphafold": false,      // Activar AlphaFold
    
    // ─────────────────────────────────────────────────────────────────
    // LISTA DETALLADA DE HERRAMIENTAS ACTIVAS (array de strings)
    // ─────────────────────────────────────────────────────────────────
    "tools": [
      // Herramientas primarias
      "web_search",
      "primekg",
      "alphafold_rag",
      
      // Sub-herramientas de PrimeKG (solo si primekg está activo)
      "kg_search_text",
      "kg_search_semantic",
      "kg_neighbors",
      "kg_subgraph",
      "kg_path",
      "kg_repurposing",
      "kg_targets",
      "kg_combinations",
      "kg_mechanisms"
    ],
    
    // Configuración de modelos (duplicada para compatibilidad)
    "model": {
      "reasoning_model": "gemini-3-pro-preview",
      "reflection_model": "gemini-3-flash-preview"
    }
  },
  
  // Duplicados a nivel raíz (para backends legacy)
  "reasoning_model": "gemini-3-pro-preview",
  "reflection_model": "gemini-3-flash-preview"
}
```

---

## 🛠️ Herramientas Disponibles

### Tabla de Referencia Rápida

| Tool ID | Categoría | Endpoint API | Descripción |
|---------|-----------|--------------|-------------|
| `web_search` | Primary | N/A (Tavily/Google) | Búsqueda web en tiempo real |
| `primekg` | Primary | Base KG | Habilita todas las herramientas KG |
| `alphafold_rag` | Primary | AlphaFold DB | Estructuras de proteínas |
| `kg_search_text` | KG Search | `GET /search/text` | Búsqueda exacta/parcial |
| `kg_search_semantic` | KG Search | `GET /search/semantic` | Búsqueda semántica AI |
| `kg_neighbors` | KG Graph | `GET /neighbors/{node}` | Vecinos 1-hop |
| `kg_subgraph` | KG Graph | `GET /subgraph/{entity}` | Subgrafo para visualización |
| `kg_path` | KG Graph | `GET /path/{src}/{tgt}` | Camino más corto |
| `kg_repurposing` | KG Hypothesis | `GET /hypothesis/repurposing/{disease}` | Candidatos de reposicionamiento |
| `kg_targets` | KG Hypothesis | `GET /hypothesis/targets/{disease}` | Dianas terapéuticas |
| `kg_combinations` | KG Hypothesis | `GET /hypothesis/combinations/{drug}` | Combinaciones de fármacos |
| `kg_mechanisms` | KG Hypothesis | `GET /hypothesis/mechanisms/{drug}/{disease}` | Mecanismo de acción |

---

### Descripción Detallada de Cada Herramienta

#### 1. `web_search` - Búsqueda Web en Tiempo Real

**Propósito:** Acceder a información actualizada de internet, incluyendo PubMed, ensayos clínicos, y literatura biomédica reciente.

**Cuándo se usa:**
- Buscar últimas publicaciones sobre un tema
- Verificar datos de ensayos clínicos actuales
- Obtener información que no está en el Knowledge Graph

**Implementación sugerida:**
```python
from langchain_community.tools.tavily_search import TavilySearchResults

@tool
def web_search(query: str) -> str:
    """
    Busca información actualizada en la web.
    Útil para encontrar literatura reciente, ensayos clínicos,
    y datos que no están en el Knowledge Graph local.
    
    Args:
        query: Términos de búsqueda en lenguaje natural
        
    Returns:
        Resultados de búsqueda con títulos, snippets y URLs
    """
    search = TavilySearchResults(max_results=5)
    return search.invoke(query)
```

---

#### 2. `primekg` - Knowledge Graph Biomédico

**Propósito:** Flag maestro que habilita el acceso al grafo de conocimiento PrimeKG con 129,375 nodos y 4,050,249 relaciones.

**Estadísticas del grafo:**
- **Nodos:** 129,375 (enfermedades, fármacos, genes, proteínas, pathways)
- **Edges:** 4,050,249 relaciones
- **Enfermedades:** 17,080
- **Fuentes:** 20 bases de datos integradas

**Comportamiento:**
- Si `primekg` está en `tools[]`, se habilitan las sub-herramientas KG seleccionadas
- Si `primekg` NO está en `tools[]`, se ignoran todas las sub-herramientas KG

---

#### 3. `alphafold_rag` - Base de Datos AlphaFold

**Propósito:** Acceder a estructuras 3D de proteínas predichas por AlphaFold2.

**Cuándo se usa:**
- Analizar sitios de unión de fármacos
- Estudiar efectos de mutaciones en estructura proteica
- Diseño de fármacos basado en estructura

**Implementación sugerida:**
```python
@tool
def alphafold_search(protein_name: str) -> dict:
    """
    Busca estructuras de proteínas en AlphaFold Database.
    
    Args:
        protein_name: Nombre de la proteína o UniProt ID
        
    Returns:
        Información estructural, confianza (pLDDT), y URL al modelo 3D
    """
    # Buscar en UniProt primero para obtener el ID
    uniprot_id = lookup_uniprot(protein_name)
    
    # Consultar AlphaFold API
    response = requests.get(
        f"https://alphafold.ebi.ac.uk/api/prediction/{uniprot_id}"
    )
    return response.json()
```

---

#### 4. `kg_search_text` - Búsqueda de Texto en KG

**Endpoint:** `GET /search/text?q={query}&limit={limit}`

**Propósito:** Búsqueda rápida por coincidencia exacta o parcial de nombres de entidades.

**Parámetros:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `q` | string | required | Término de búsqueda |
| `limit` | int | 10 | Máximo de resultados |

**Ejemplo de Request:**
```bash
GET /search/text?q=aspirin&limit=5
```

**Ejemplo de Response:**
```json
{
  "results": [
    {
      "node_index": 12345,
      "node_name": "Aspirin",
      "node_type": "drug",
      "score": 1.0
    },
    {
      "node_index": 12346,
      "node_name": "Aspirin-induced asthma",
      "node_type": "disease",
      "score": 0.85
    }
  ],
  "total": 2,
  "query": "aspirin"
}
```

**Implementación LangChain:**
```python
@tool
def kg_search_text(query: str, limit: int = 10) -> str:
    """
    Busca entidades en PrimeKG por coincidencia de texto.
    Ideal para buscar entidades con nombres conocidos.
    
    Args:
        query: Nombre exacto o parcial de la entidad (ej: "Aspirin", "TP53")
        limit: Número máximo de resultados (default: 10)
        
    Returns:
        Lista de entidades encontradas con tipo y score de coincidencia
    """
    response = requests.get(
        f"{KG_BASE_URL}/search/text",
        params={"q": query, "limit": limit}
    )
    return json.dumps(response.json(), indent=2)
```

---

#### 5. `kg_search_semantic` - Búsqueda Semántica en KG

**Endpoint:** `GET /search/semantic?q={query}&limit={limit}`

**Propósito:** Búsqueda por similitud semántica usando embeddings. Encuentra entidades conceptualmente relacionadas aunque usen terminología diferente.

**Parámetros:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `q` | string | required | Query en lenguaje natural |
| `limit` | int | 10 | Máximo de resultados |

**Ejemplo de Request:**
```bash
GET /search/semantic?q=drugs%20that%20treat%20lung%20cancer&limit=10
```

**Ejemplo de Response:**
```json
{
  "results": [
    {
      "node_index": 8923,
      "node_name": "Pembrolizumab",
      "node_type": "drug",
      "similarity": 0.89
    },
    {
      "node_index": 7234,
      "node_name": "Osimertinib",
      "node_type": "drug",
      "similarity": 0.87
    }
  ],
  "total": 10,
  "query": "drugs that treat lung cancer",
  "embedding_model": "all-MiniLM-L6-v2"
}
```

**Implementación LangChain:**
```python
@tool
def kg_search_semantic(query: str, limit: int = 10) -> str:
    """
    Búsqueda semántica en PrimeKG usando embeddings de AI.
    Encuentra entidades conceptualmente similares incluso con
    terminología diferente.
    
    Args:
        query: Descripción en lenguaje natural (ej: "drugs for breast cancer")
        limit: Número máximo de resultados
        
    Returns:
        Entidades ordenadas por similitud semántica
    """
    response = requests.get(
        f"{KG_BASE_URL}/search/semantic",
        params={"q": query, "limit": limit}
    )
    return json.dumps(response.json(), indent=2)
```

---

#### 6. `kg_neighbors` - Vecinos de una Entidad

**Endpoint:** `GET /neighbors/{node_name}?limit={limit}`

**Propósito:** Obtener todas las entidades directamente conectadas (1-hop) a una entidad específica.

**Parámetros:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `node_name` | string | required | Nombre de la entidad |
| `limit` | int | 50 | Máximo de vecinos |

**Ejemplo de Request:**
```bash
GET /neighbors/TP53?limit=20
```

**Ejemplo de Response:**
```json
{
  "center_node": {
    "name": "TP53",
    "type": "gene/protein"
  },
  "neighbors": [
    {
      "node_name": "Li-Fraumeni syndrome",
      "node_type": "disease",
      "edge_type": "gene_associated_with_disease",
      "direction": "outgoing"
    },
    {
      "node_name": "MDM2",
      "node_type": "gene/protein",
      "edge_type": "protein_protein_interaction",
      "direction": "bidirectional"
    },
    {
      "node_name": "Nutlin-3",
      "node_type": "drug",
      "edge_type": "drug_targets_gene",
      "direction": "incoming"
    }
  ],
  "total_neighbors": 156,
  "returned": 20
}
```

**Implementación LangChain:**
```python
@tool
def kg_neighbors(node_name: str, limit: int = 50) -> str:
    """
    Obtiene todas las entidades directamente conectadas a un nodo.
    Retorna fármacos, enfermedades, genes, y otros elementos
    relacionados con la entidad especificada.
    
    Args:
        node_name: Nombre de la entidad central (ej: "TP53", "Aspirin")
        limit: Máximo de vecinos a retornar
        
    Returns:
        Lista de entidades conectadas con tipo de relación
    """
    response = requests.get(
        f"{KG_BASE_URL}/neighbors/{node_name}",
        params={"limit": limit}
    )
    return json.dumps(response.json(), indent=2)
```

---

#### 7. `kg_path` - Camino entre Entidades

**Endpoint:** `GET /path/{source}/{target}?max_hops={max_hops}`

**Propósito:** Encontrar el camino más corto entre dos entidades en el grafo. Revela conexiones ocultas y mecanismos.

**Parámetros:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `source` | string | required | Entidad de origen |
| `target` | string | required | Entidad destino |
| `max_hops` | int | 4 | Máximo de saltos |

**Ejemplo de Request:**
```bash
GET /path/Metformin/Breast%20cancer?max_hops=3
```

**Ejemplo de Response:**
```json
{
  "source": "Metformin",
  "target": "Breast cancer",
  "paths": [
    {
      "length": 2,
      "nodes": ["Metformin", "AMPK", "Breast cancer"],
      "edges": [
        {"from": "Metformin", "to": "AMPK", "type": "drug_activates"},
        {"from": "AMPK", "to": "Breast cancer", "type": "gene_associated_with_disease"}
      ]
    },
    {
      "length": 3,
      "nodes": ["Metformin", "mTOR", "AKT1", "Breast cancer"],
      "edges": [
        {"from": "Metformin", "to": "mTOR", "type": "drug_inhibits"},
        {"from": "mTOR", "to": "AKT1", "type": "protein_protein_interaction"},
        {"from": "AKT1", "to": "Breast cancer", "type": "gene_associated_with_disease"}
      ]
    }
  ],
  "total_paths_found": 2
}
```

**Implementación LangChain:**
```python
@tool
def kg_path(source: str, target: str, max_hops: int = 4) -> str:
    """
    Encuentra el camino más corto entre dos entidades en el grafo.
    Útil para descubrir mecanismos ocultos y conexiones indirectas.
    
    Args:
        source: Entidad de inicio (ej: "Metformin")
        target: Entidad destino (ej: "Breast cancer")
        max_hops: Máximo número de pasos intermedios
        
    Returns:
        Todos los caminos encontrados con nodos y tipos de relación
    """
    response = requests.get(
        f"{KG_BASE_URL}/path/{source}/{target}",
        params={"max_hops": max_hops}
    )
    return json.dumps(response.json(), indent=2)
```

---

#### 8. `kg_subgraph` - Subgrafo para Visualización

**Endpoint:** `GET /subgraph/{entity}?depth={depth}&limit={limit}`

**Propósito:** Extraer un subgrafo local centrado en una entidad para renderizar en el frontend.

**Parámetros:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `entity` | string | required | Entidad central |
| `depth` | int | 2 | Profundidad del subgrafo |
| `limit` | int | 100 | Máximo de nodos |

**Ejemplo de Response:**
```json
{
  "nodes": [
    {"id": "TP53", "type": "gene", "group": 1},
    {"id": "MDM2", "type": "gene", "group": 1},
    {"id": "Li-Fraumeni syndrome", "type": "disease", "group": 2}
  ],
  "links": [
    {"source": "TP53", "target": "MDM2", "type": "ppi"},
    {"source": "TP53", "target": "Li-Fraumeni syndrome", "type": "associated"}
  ]
}
```

---

#### 9. `kg_repurposing` - Candidatos de Drug Repurposing

**Endpoint:** `GET /hypothesis/repurposing/{disease}?limit={limit}`

**Propósito:** Identificar fármacos existentes que podrían tratar una enfermedad basándose en dianas moleculares compartidas y pathways.

**Parámetros:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `disease` | string | required | Nombre de la enfermedad |
| `limit` | int | 20 | Máximo de candidatos |

**Ejemplo de Request:**
```bash
GET /hypothesis/repurposing/Leiomyosarcoma?limit=10
```

**Ejemplo de Response:**
```json
{
  "disease": "Leiomyosarcoma",
  "candidates": [
    {
      "drug": "Pazopanib",
      "original_indication": "Renal cell carcinoma",
      "score": 0.92,
      "evidence": {
        "shared_targets": ["VEGFR1", "VEGFR2", "PDGFR"],
        "shared_pathways": ["Angiogenesis", "RTK signaling"],
        "supporting_literature": 12
      },
      "mechanism": "Pazopanib inhibits VEGFR and PDGFR, which are overexpressed in Leiomyosarcoma, reducing tumor angiogenesis."
    },
    {
      "drug": "Trabectedin",
      "original_indication": "Ovarian cancer",
      "score": 0.88,
      "evidence": {
        "shared_targets": ["DNA repair machinery"],
        "shared_pathways": ["DNA damage response"],
        "supporting_literature": 8
      },
      "mechanism": "Trabectedin binds to minor groove of DNA and disrupts transcription, effective in soft tissue sarcomas."
    }
  ],
  "total_candidates": 10,
  "methodology": "Network-based drug repurposing using target overlap and pathway enrichment"
}
```

**Implementación LangChain:**
```python
@tool
def kg_repurposing(disease: str, limit: int = 20) -> str:
    """
    Identifica fármacos existentes que podrían reposicionarse para
    tratar una enfermedad específica, basándose en:
    - Dianas moleculares compartidas
    - Pathways en común
    - Similitud de mecanismo de acción
    
    Args:
        disease: Nombre de la enfermedad (ej: "Leiomyosarcoma")
        limit: Número máximo de candidatos
        
    Returns:
        Lista de fármacos candidatos con score de evidencia y mecanismo propuesto
    """
    response = requests.get(
        f"{KG_BASE_URL}/hypothesis/repurposing/{disease}",
        params={"limit": limit}
    )
    return json.dumps(response.json(), indent=2)
```

---

#### 10. `kg_targets` - Descubrimiento de Dianas Terapéuticas

**Endpoint:** `GET /hypothesis/targets/{disease}?limit={limit}`

**Propósito:** Identificar genes/proteínas que podrían ser dianas terapéuticas para una enfermedad usando análisis de redes.

**Ejemplo de Response:**
```json
{
  "disease": "Pancreatic cancer",
  "therapeutic_targets": [
    {
      "target": "KRAS",
      "target_type": "gene",
      "score": 0.95,
      "druggability": "difficult",
      "existing_drugs": [],
      "rationale": "Mutated in >90% of pancreatic cancers, central oncogenic driver"
    },
    {
      "target": "CDK4",
      "target_type": "gene",
      "score": 0.82,
      "druggability": "high",
      "existing_drugs": ["Palbociclib", "Ribociclib"],
      "rationale": "Downstream effector of KRAS, druggable with CDK4/6 inhibitors"
    }
  ]
}
```

---

#### 11. `kg_combinations` - Combinaciones de Fármacos

**Endpoint:** `GET /hypothesis/combinations/{drug}?limit={limit}`

**Propósito:** Descubrir combinaciones sinérgicas de fármacos basadas en mecanismos complementarios.

**Ejemplo de Response:**
```json
{
  "primary_drug": "Pembrolizumab",
  "combinations": [
    {
      "partner_drug": "Lenvatinib",
      "synergy_score": 0.91,
      "mechanism": "Pembrolizumab (anti-PD1) + Lenvatinib (anti-VEGF) provide complementary immune activation and anti-angiogenic effects",
      "approved_indications": ["Endometrial carcinoma", "Renal cell carcinoma"],
      "clinical_trials": 15
    }
  ]
}
```

---

#### 12. `kg_mechanisms` - Análisis de Mecanismo de Acción

**Endpoint:** `GET /hypothesis/mechanisms/{drug}/{disease}`

**Propósito:** Explicar CÓMO un fármaco trata (o podría tratar) una enfermedad a nivel molecular.

**Ejemplo de Request:**
```bash
GET /hypothesis/mechanisms/Imatinib/Chronic%20myeloid%20leukemia
```

**Ejemplo de Response:**
```json
{
  "drug": "Imatinib",
  "disease": "Chronic myeloid leukemia",
  "mechanisms": [
    {
      "pathway": "BCR-ABL signaling inhibition",
      "description": "Imatinib competitively binds to ATP-binding site of BCR-ABL fusion protein, blocking its constitutive kinase activity",
      "molecular_path": [
        "Imatinib",
        "→ inhibits → BCR-ABL",
        "→ blocks → downstream signaling (RAS, PI3K, JAK-STAT)",
        "→ restores → normal apoptosis in leukemic cells"
      ],
      "confidence": 0.98,
      "supporting_evidence": {
        "pubmed_ids": ["11423618", "12637455"],
        "clinical_response_rate": "95% in chronic phase"
      }
    }
  ]
}
```

**Implementación LangChain:**
```python
@tool
def kg_mechanisms(drug: str, disease: str) -> str:
    """
    Explica el mecanismo molecular por el cual un fármaco trata
    (o podría tratar) una enfermedad específica.
    
    Retorna:
    - Pathways moleculares involucrados
    - Cascada de señalización afectada
    - Evidencia de literatura científica
    
    Args:
        drug: Nombre del fármaco (ej: "Imatinib")
        disease: Nombre de la enfermedad (ej: "Chronic myeloid leukemia")
        
    Returns:
        Explicación detallada del mecanismo con rutas moleculares
    """
    response = requests.get(
        f"{KG_BASE_URL}/hypothesis/mechanisms/{drug}/{disease}"
    )
    return json.dumps(response.json(), indent=2)
```

---

## 🔧 Implementación en LangChain

### Estructura del Proyecto Backend

```
sarkome-agent/
├── main.py                    # Entry point (FastAPI + LangServe)
├── agent/
│   ├── __init__.py
│   ├── graph.py              # LangGraph state machine
│   ├── state.py              # Agent state definition
│   └── nodes/
│       ├── __init__.py
│       ├── router.py         # Tool routing logic
│       ├── reasoner.py       # Main reasoning node
│       └── researcher.py     # Research/search node
├── tools/
│   ├── __init__.py
│   ├── registry.py           # Dynamic tool registration
│   ├── web_search.py         # Web search tool
│   ├── alphafold.py          # AlphaFold tool
│   └── knowledge_graph/
│       ├── __init__.py
│       ├── search.py         # kg_search_text, kg_search_semantic
│       ├── traversal.py      # kg_neighbors, kg_path, kg_subgraph
│       └── hypothesis.py     # kg_repurposing, kg_targets, etc.
├── config.py                 # Configuration
└── requirements.txt
```

### Tool Registry (Registro Dinámico)

```python
# tools/registry.py

from typing import List, Dict, Callable
from langchain_core.tools import BaseTool

# Import all tools
from tools.web_search import web_search_tool
from tools.alphafold import alphafold_tool
from tools.knowledge_graph.search import kg_search_text_tool, kg_search_semantic_tool
from tools.knowledge_graph.traversal import kg_neighbors_tool, kg_path_tool, kg_subgraph_tool
from tools.knowledge_graph.hypothesis import (
    kg_repurposing_tool, 
    kg_targets_tool, 
    kg_combinations_tool,
    kg_mechanisms_tool
)

# Master registry of all available tools
TOOL_REGISTRY: Dict[str, BaseTool] = {
    # Primary tools
    "web_search": web_search_tool,
    "alphafold_rag": alphafold_tool,
    
    # KG Search tools
    "kg_search_text": kg_search_text_tool,
    "kg_search_semantic": kg_search_semantic_tool,
    
    # KG Traversal tools
    "kg_neighbors": kg_neighbors_tool,
    "kg_path": kg_path_tool,
    "kg_subgraph": kg_subgraph_tool,
    
    # KG Hypothesis tools
    "kg_repurposing": kg_repurposing_tool,
    "kg_targets": kg_targets_tool,
    "kg_combinations": kg_combinations_tool,
    "kg_mechanisms": kg_mechanisms_tool,
}

# Tools that require PrimeKG to be enabled
KG_DEPENDENT_TOOLS = {
    "kg_search_text",
    "kg_search_semantic",
    "kg_neighbors",
    "kg_path",
    "kg_subgraph",
    "kg_repurposing",
    "kg_targets",
    "kg_combinations",
    "kg_mechanisms",
}


def get_active_tools(tool_ids: List[str], enable_kg: bool = True) -> List[BaseTool]:
    """
    Filtra y retorna solo las herramientas activas según la configuración del usuario.
    
    Args:
        tool_ids: Lista de IDs de herramientas activas (del frontend)
        enable_kg: Flag maestro para PrimeKG
        
    Returns:
        Lista de herramientas LangChain listas para usar
    """
    active_tools = []
    
    for tool_id in tool_ids:
        # Skip KG tools if PrimeKG is disabled
        if tool_id in KG_DEPENDENT_TOOLS and not enable_kg:
            continue
            
        # Skip if primekg itself (it's just a flag, not a tool)
        if tool_id == "primekg":
            continue
            
        # Get the tool from registry
        if tool_id in TOOL_REGISTRY:
            active_tools.append(TOOL_REGISTRY[tool_id])
        else:
            print(f"Warning: Unknown tool ID '{tool_id}', skipping")
    
    return active_tools
```

### Integración con LangGraph

```python
# agent/graph.py

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_google_genai import ChatGoogleGenerativeAI
from tools.registry import get_active_tools

def create_agent(config: dict):
    """
    Crea un agente con herramientas dinámicas según la configuración.
    
    Args:
        config: Configuración del frontend incluyendo 'tools' y 'enable_kg'
    """
    # Extraer configuración de herramientas
    tool_ids = config.get("tools", ["web_search"])
    enable_kg = config.get("enable_kg", True)
    
    # Obtener herramientas activas
    active_tools = get_active_tools(tool_ids, enable_kg)
    
    if not active_tools:
        # Default: al menos web_search
        from tools.web_search import web_search_tool
        active_tools = [web_search_tool]
    
    # Configurar modelo
    reasoning_model = config.get("reasoning_model", "gemini-3-pro-preview")
    
    llm = ChatGoogleGenerativeAI(
        model=reasoning_model,
        temperature=0.7,
    )
    
    # Bind tools al modelo
    llm_with_tools = llm.bind_tools(active_tools)
    
    # Crear el grafo
    workflow = StateGraph(AgentState)
    
    # Nodo de razonamiento
    def reasoning_node(state):
        messages = state["messages"]
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}
    
    # Nodo de herramientas
    tool_node = ToolNode(active_tools)
    
    # Agregar nodos
    workflow.add_node("reason", reasoning_node)
    workflow.add_node("tools", tool_node)
    
    # Definir flujo
    workflow.set_entry_point("reason")
    
    def should_continue(state):
        last_message = state["messages"][-1]
        if last_message.tool_calls:
            return "tools"
        return END
    
    workflow.add_conditional_edges("reason", should_continue)
    workflow.add_edge("tools", "reason")
    
    return workflow.compile()
```

### Endpoint Principal

```python
# main.py

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from langserve import add_routes
import json

app = FastAPI()

@app.post("/runs/stream")
async def run_stream(request: dict):
    """
    Endpoint principal que recibe las consultas del frontend.
    """
    # Extraer configuración
    config = request.get("config", {})
    input_data = request.get("input", {})
    
    # Obtener lista de herramientas activas
    tools = config.get("tools", ["web_search"])
    enable_kg = config.get("enable_kg", True)
    enable_web = config.get("enable_web_search", True)
    
    # Log para debugging
    print(f"Active tools: {tools}")
    print(f"Enable KG: {enable_kg}, Enable Web: {enable_web}")
    
    # Crear agente con herramientas dinámicas
    agent = create_agent(config)
    
    # Ejecutar con streaming
    async def generate():
        async for event in agent.astream_events(
            {"messages": input_data.get("messages", [])},
            version="v2"
        ):
            yield f"data: {json.dumps(event)}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    )
```

---

## 📡 Knowledge Graph API

### Base URL
```
Development: http://localhost:8000
Production: https://kg.sarkome.com/api
```

### Health Check

```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "graph_loaded": true,
  "embeddings_loaded": true,
  "node_count": 129375,
  "edge_count": 4050249
}
```

### Estadísticas

```bash
GET /stats
```

**Response:**
```json
{
  "total_nodes": 129375,
  "total_edges": 4050249,
  "node_types": {
    "disease": 17080,
    "drug": 7957,
    "gene/protein": 27671,
    "pathway": 2516,
    "anatomy": 14035,
    "biological_process": 28642,
    "molecular_function": 11169,
    "cellular_component": 4176,
    "exposure": 818,
    "effect/phenotype": 15311
  },
  "edge_types": {
    "protein_protein_interaction": 642150,
    "drug_targets_gene": 51410,
    "gene_associated_with_disease": 69850,
    "drug_treats_disease": 5920,
    ...
  },
  "sources": [
    "DrugBank", "OMIM", "DisGeNET", "STRING", "Reactome",
    "GO", "SIDER", "Orphanet", "MONDO", "HPO", ...
  ]
}
```

---

## 🔄 Flujo de Ejecución

```
1. Usuario escribe consulta
   └─▶ Frontend (InputForm)
   
2. Usuario selecciona herramientas
   └─▶ tools: ["web_search", "primekg", "kg_search_semantic", "kg_repurposing"]
   
3. Frontend envía POST /runs/stream
   └─▶ {
         input: { messages: [...] },
         config: {
           tools: [...],
           enable_kg: true,
           ...
         }
       }
       
4. Backend recibe y parsea
   └─▶ tools = config.tools
   └─▶ enable_kg = config.enable_kg
   
5. Backend filtra herramientas
   └─▶ active_tools = get_active_tools(tools, enable_kg)
   └─▶ [web_search_tool, kg_search_semantic_tool, kg_repurposing_tool]
   
6. Backend crea agente con herramientas filtradas
   └─▶ llm.bind_tools(active_tools)
   
7. Agente ejecuta razonamiento
   └─▶ LLM decide qué herramienta usar
   └─▶ Ejecuta kg_search_semantic("drugs for sarcoma")
   └─▶ Ejecuta kg_repurposing("Leiomyosarcoma")
   
8. Backend hace streaming de respuesta
   └─▶ SSE events con progreso y resultado
   
9. Frontend renderiza respuesta
   └─▶ ChatMessagesView muestra resultado
```

---

## ⚠️ Manejo de Errores

### Códigos de Error del KG API

| Código | Significado | Acción |
|--------|-------------|--------|
| 200 | Éxito | Procesar respuesta |
| 400 | Request inválido | Verificar parámetros |
| 404 | Entidad no encontrada | Sugerir alternativas |
| 429 | Rate limit excedido | Esperar y reintentar |
| 500 | Error interno | Reportar y fallback |
| 503 | Servicio no disponible | Usar cache o fallback |

### Ejemplo de Error Handling

```python
@tool
def kg_search_with_fallback(query: str) -> str:
    """Búsqueda con manejo de errores robusto."""
    try:
        response = requests.get(
            f"{KG_BASE_URL}/search/semantic",
            params={"q": query},
            timeout=10
        )
        response.raise_for_status()
        return json.dumps(response.json())
        
    except requests.exceptions.Timeout:
        return json.dumps({
            "error": "timeout",
            "message": "La búsqueda tardó demasiado. Intenta con un query más específico.",
            "fallback": "Usando búsqueda de texto como alternativa..."
        })
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return json.dumps({
                "error": "not_found",
                "message": f"No se encontraron resultados para '{query}'",
                "suggestion": "Intenta con sinónimos o términos más generales"
            })
        raise
        
    except Exception as e:
        return json.dumps({
            "error": "unknown",
            "message": str(e)
        })
```

---

## 📋 Ejemplos Completos

### Ejemplo 1: Consulta de Drug Repurposing

**Input del usuario:**
> "¿Qué fármacos existentes podrían servir para tratar leiomiosarcoma?"

**Herramientas activas:**
```json
["web_search", "primekg", "kg_search_semantic", "kg_repurposing", "kg_mechanisms"]
```

**Flujo del agente:**
1. `kg_search_semantic("leiomyosarcoma treatment")` → Encuentra entidades relacionadas
2. `kg_repurposing("Leiomyosarcoma")` → Obtiene candidatos de repurposing
3. `kg_mechanisms("Pazopanib", "Leiomyosarcoma")` → Explica mecanismo del mejor candidato
4. `web_search("Pazopanib leiomyosarcoma clinical trials 2025")` → Verifica evidencia clínica actual

**Respuesta final:**
> "Basándome en el análisis del Knowledge Graph y literatura reciente, los principales candidatos de drug repurposing para Leiomiosarcoma son:
> 
> 1. **Pazopanib** (Score: 0.92) - Originalmente para cáncer renal, inhibe VEGFR/PDGFR que están sobreexpresados en LMS. Ya aprobado por FDA para sarcomas de tejidos blandos.
> 
> 2. **Trabectedin** (Score: 0.88) - Se une al surco menor del DNA, efectivo en sarcomas. 
> 
> ..."

---

### Ejemplo 2: Análisis de Mutación

**Input del usuario:**
> "Mi paciente tiene una mutación TP53 R273H. ¿Qué opciones de tratamiento hay?"

**Herramientas activas:**
```json
["primekg", "kg_neighbors", "kg_path", "kg_targets", "alphafold_rag"]
```

**Flujo del agente:**
1. `kg_neighbors("TP53")` → Obtiene genes/drugs conectados a TP53
2. `kg_path("TP53", "drug")` → Encuentra fármacos que targetean la vía de TP53
3. `kg_targets("TP53-related cancer")` → Identifica dianas downstream
4. `alphafold_search("TP53")` → Analiza estructura y efecto de R273H

---

## 📚 Referencias

- [LangChain Tools Documentation](https://python.langchain.com/docs/modules/tools/)
- [LangGraph Guide](https://langchain-ai.github.io/langgraph/)
- [PrimeKG Paper](https://www.nature.com/articles/s41597-023-02323-0)
- [AlphaFold Database API](https://alphafold.ebi.ac.uk/api-docs)

---

## 🤝 Contacto

Para preguntas sobre esta especificación:
- **Email:** engineering@sarkome.com
- **Slack:** #backend-tools

---

*Documento generado para Sarkome v1.0 - Enero 2026*
