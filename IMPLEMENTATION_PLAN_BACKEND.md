# Sarkome Backend - Persistent Runs Implementation Plan (GCP Production)

**Objetivo:** Implementar runs persistentes en GCP con Pulumi, usando una base de datos NoSQL economica para 100 usuarios activos 24/7.

**Problema Actual:** El frontend usa fetch streaming. Cuando el usuario navega a otra pagina, la conexion se aborta y el run se cancela.

**Solucion:** Sistema de runs asincrono con persistencia en **Firestore** (NoSQL serverless de GCP).

---

## Comparacion de Opciones NoSQL para 100 Usuarios

| Servicio | Free Tier | Costo Estimado/Mes | Pros | Contras |
|----------|-----------|-------------------|------|---------|
| **Firestore** | 1GB + 50K reads + 20K writes/dia | **$0-5** | Nativo GCP, Pulumi support, serverless | - |
| **Upstash Redis** | 256MB + 500K commands | **$2-10** | Muy rapido, global | Externo a GCP |
| **MongoDB Atlas** | 512MB | **$0-57** | Flexible | Free tier limitado |
| **Cloud Datastore** | 1GB + 50K reads/dia | **$0-10** | Legacy, estable | API antigua |

### Recomendacion: **Firestore**

**Por que Firestore para Sarkome:**

1. **Costo para 100 usuarios activos 24/7:**
   - ~500 runs/dia = 500 writes + 2500 reads = **$0.50/dia = ~$15/mes**
   - Con Free Tier: **~$0-5/mes** (los primeros 20K writes/dia son gratis)

2. **Integracion nativa con GCP:**
   - Mismo proyecto que Cloud Run
   - IAM automatico (no necesitas API keys adicionales)
   - Pulumi tiene soporte completo

3. **Serverless:**
   - Escala a cero cuando no hay uso
   - Sin instancias que mantener

---

## Arquitectura GCP

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vercel)                           │
│  POST /runs → recibe run_id                                     │
│  GET /runs/{run_id} → verifica estado                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 CLOUD RUN (Backend LangGraph)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              RUN MANAGER                                    │ │
│  │  - Crea runs en background (asyncio.create_task)           │ │
│  │  - Guarda estado en Firestore                              │ │
│  │  - Stream de eventos via SSE                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIRESTORE DATABASE                          │
│  Collection: runs                                                │
│    ├── {run_id}/                                                │
│    │   ├── status: "running" | "completed" | "failed"          │
│    │   ├── created_at: timestamp                                │
│    │   ├── input_messages: array                                │
│    │   ├── output_messages: array                               │
│    │   ├── events: array (subcollection o array)               │
│    │   └── usage_metadata: map                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Infraestructura Pulumi

### 1.1 Crear Firestore Database

Agregar a tu archivo Pulumi (`deploy/__main__.py` o similar):

```python
"""
Pulumi infrastructure for Sarkome Backend with Firestore.
"""
import pulumi
import pulumi_gcp as gcp

# Get config
config = pulumi.Config()
project = gcp.config.project
region = config.get("region") or "us-central1"

# ============================================================================
# FIRESTORE DATABASE
# ============================================================================

# Enable Firestore API
firestore_api = gcp.projects.Service(
    "firestore-api",
    service="firestore.googleapis.com",
    disable_on_destroy=False,
)

# Create Firestore database (Native mode)
firestore_db = gcp.firestore.Database(
    "sarkome-runs-db",
    name="(default)",  # Use default database (free tier eligible)
    location_id=region,
    type="FIRESTORE_NATIVE",
    concurrency_mode="OPTIMISTIC",
    app_engine_integration_mode="DISABLED",
    opts=pulumi.ResourceOptions(depends_on=[firestore_api]),
)

# Create indexes for efficient queries
runs_by_user_index = gcp.firestore.Index(
    "runs-by-user-index",
    collection="runs",
    database=firestore_db.name,
    fields=[
        gcp.firestore.IndexFieldArgs(
            field_path="user_id",
            order="ASCENDING",
        ),
        gcp.firestore.IndexFieldArgs(
            field_path="created_at",
            order="DESCENDING",
        ),
    ],
    opts=pulumi.ResourceOptions(depends_on=[firestore_db]),
)

runs_by_status_index = gcp.firestore.Index(
    "runs-by-status-index",
    collection="runs",
    database=firestore_db.name,
    fields=[
        gcp.firestore.IndexFieldArgs(
            field_path="status",
            order="ASCENDING",
        ),
        gcp.firestore.IndexFieldArgs(
            field_path="created_at",
            order="DESCENDING",
        ),
    ],
    opts=pulumi.ResourceOptions(depends_on=[firestore_db]),
)

# ============================================================================
# CLOUD RUN SERVICE (actualizar existente)
# ============================================================================

# Agregar rol de Firestore al service account de Cloud Run
firestore_user_binding = gcp.projects.IAMMember(
    "cloudrun-firestore-user",
    project=project,
    role="roles/datastore.user",
    member=pulumi.Output.concat(
        "serviceAccount:",
        cloud_run_service_account.email  # Tu service account existente
    ),
)

# Exports
pulumi.export("firestore_database", firestore_db.name)
pulumi.export("firestore_location", firestore_db.location_id)
```

### 1.2 Actualizar Cloud Run Environment

Agregar variable de entorno al Cloud Run service existente:

```python
# En tu definicion de Cloud Run service
gcp.cloudrunv2.Service(
    "sarkome-backend",
    # ... configuracion existente ...
    template=gcp.cloudrunv2.ServiceTemplateArgs(
        containers=[
            gcp.cloudrunv2.ServiceTemplateContainerArgs(
                # ... configuracion existente ...
                envs=[
                    # ... variables existentes ...
                    gcp.cloudrunv2.ServiceTemplateContainerEnvArgs(
                        name="FIRESTORE_DATABASE",
                        value="(default)",
                    ),
                    gcp.cloudrunv2.ServiceTemplateContainerEnvArgs(
                        name="GCP_PROJECT",
                        value=project,
                    ),
                ],
            ),
        ],
    ),
)
```

---

## Fase 2: Run Store con Firestore

### 2.1 Dependencias

Agregar a `requirements.txt`:

```
google-cloud-firestore>=2.16.0
```

### 2.2 Firestore Run Store

Crear archivo: `src/agent/run_store_firestore.py`

```python
"""
Firestore-based Run Storage for Sarkome Agent.
Production-ready storage for persistent runs on GCP.
"""
import os
import asyncio
from datetime import datetime, timezone
from typing import Optional, Literal, Any
from pydantic import BaseModel, Field
from google.cloud import firestore
from google.cloud.firestore_v1 import AsyncClient
import logging

logger = logging.getLogger("sarkome_agent.run_store")

# Firestore client (lazy initialization)
_db: Optional[AsyncClient] = None

def get_db() -> AsyncClient:
    """Get async Firestore client (singleton)."""
    global _db
    if _db is None:
        project = os.getenv("GCP_PROJECT")
        database = os.getenv("FIRESTORE_DATABASE", "(default)")
        _db = AsyncClient(project=project, database=database)
    return _db

# Collection name
RUNS_COLLECTION = "runs"


class RunStatus(BaseModel):
    """Status of a single run."""
    run_id: str
    thread_id: str
    user_id: Optional[str] = None
    
    # State
    status: Literal["pending", "running", "completed", "failed", "cancelled"] = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    
    # Input
    input_messages: list[dict] = []
    config: dict = {}
    
    # Progress
    current_node: Optional[str] = None
    events: list[dict] = []
    
    # Output
    output_messages: list[dict] = []
    final_state: Optional[dict] = None
    error: Optional[str] = None
    
    # Metrics
    usage_metadata: dict = {}
    sources_gathered: dict = {}

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class FirestoreRunStore:
    """Firestore-based storage for runs."""
    
    @classmethod
    async def save(cls, run: RunStatus) -> None:
        """Save run to Firestore."""
        run.updated_at = datetime.now(timezone.utc)
        db = get_db()
        doc_ref = db.collection(RUNS_COLLECTION).document(run.run_id)
        await doc_ref.set(run.model_dump(mode="json"))
        logger.debug(f"Saved run {run.run_id} to Firestore")
    
    @classmethod
    async def load(cls, run_id: str) -> Optional[RunStatus]:
        """Load run from Firestore."""
        db = get_db()
        doc_ref = db.collection(RUNS_COLLECTION).document(run_id)
        doc = await doc_ref.get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        # Parse datetime strings back to datetime objects
        for field in ["created_at", "updated_at", "completed_at"]:
            if data.get(field) and isinstance(data[field], str):
                data[field] = datetime.fromisoformat(data[field].replace("Z", "+00:00"))
        return RunStatus(**data)
    
    @classmethod
    async def update_status(
        cls, 
        run_id: str, 
        status: str, 
        **kwargs
    ) -> Optional[RunStatus]:
        """Update run status and additional fields atomically."""
        db = get_db()
        doc_ref = db.collection(RUNS_COLLECTION).document(run_id)
        
        update_data = {
            "status": status,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        for key, value in kwargs.items():
            if isinstance(value, datetime):
                value = value.isoformat()
            update_data[key] = value
        
        await doc_ref.update(update_data)
        return await cls.load(run_id)
    
    @classmethod
    async def add_event(cls, run_id: str, event: dict) -> None:
        """Append an event to the run's event log."""
        db = get_db()
        doc_ref = db.collection(RUNS_COLLECTION).document(run_id)
        
        event_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": event
        }
        
        # Use arrayUnion for atomic append
        await doc_ref.update({
            "events": firestore.ArrayUnion([event_entry]),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })
    
    @classmethod
    async def list_runs(
        cls, 
        user_id: Optional[str] = None, 
        limit: int = 50
    ) -> list[RunStatus]:
        """List runs, optionally filtered by user_id."""
        db = get_db()
        query = db.collection(RUNS_COLLECTION)
        
        if user_id:
            query = query.where("user_id", "==", user_id)
        
        query = query.order_by("created_at", direction=firestore.Query.DESCENDING)
        query = query.limit(limit)
        
        runs = []
        async for doc in query.stream():
            data = doc.to_dict()
            for field in ["created_at", "updated_at", "completed_at"]:
                if data.get(field) and isinstance(data[field], str):
                    data[field] = datetime.fromisoformat(data[field].replace("Z", "+00:00"))
            runs.append(RunStatus(**data))
        
        return runs
    
    @classmethod
    async def cleanup_old_runs(cls, max_age_hours: int = 24) -> int:
        """Delete runs older than max_age_hours. Returns count deleted."""
        db = get_db()
        cutoff = datetime.now(timezone.utc).timestamp() - (max_age_hours * 3600)
        cutoff_dt = datetime.fromtimestamp(cutoff, tz=timezone.utc)
        
        query = db.collection(RUNS_COLLECTION).where(
            "created_at", "<", cutoff_dt.isoformat()
        ).where(
            "status", "in", ["completed", "failed", "cancelled"]
        )
        
        deleted = 0
        async for doc in query.stream():
            await doc.reference.delete()
            deleted += 1
        
        return deleted


# Alias for compatibility
RunStore = FirestoreRunStore
```

---

## Fase 3: Run Manager (Background Execution)

### 3.1 Run Manager

Crear archivo: `src/agent/run_manager.py`

```python
"""
Run Manager - Executes agent runs in background tasks with Firestore persistence.
"""
import asyncio
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, AsyncGenerator

from .run_store_firestore import RunStore, RunStatus
from .graph import graph
from .configuration import Configuration

logger = logging.getLogger("sarkome_agent.run_manager")

# In-memory registry of active runs (run_id -> asyncio.Task)
_active_runs: dict[str, asyncio.Task] = {}

# Event queues for streaming reconnection (run_id -> asyncio.Queue)
_event_queues: dict[str, asyncio.Queue] = {}


async def start_run(
    thread_id: str,
    messages: list[dict],
    config: dict,
    user_id: Optional[str] = None
) -> str:
    """
    Start a new agent run in the background.
    Returns the run_id immediately.
    """
    run_id = str(uuid.uuid4())[:12]
    
    # Create initial run record in Firestore
    run = RunStatus(
        run_id=run_id,
        thread_id=thread_id,
        user_id=user_id,
        status="pending",
        input_messages=messages,
        config=config
    )
    await RunStore.save(run)
    
    # Create event queue for this run
    _event_queues[run_id] = asyncio.Queue()
    
    # Start background task
    task = asyncio.create_task(_execute_run(run_id))
    _active_runs[run_id] = task
    
    # Add cleanup callback
    task.add_done_callback(lambda t: _cleanup_run(run_id))
    
    logger.info(f"Started background run {run_id} for thread {thread_id}")
    return run_id


async def _execute_run(run_id: str) -> None:
    """Internal: Execute the LangGraph agent and stream events."""
    run = await RunStore.load(run_id)
    if not run:
        logger.error(f"Run {run_id} not found")
        return
    
    try:
        await RunStore.update_status(run_id, "running")
        
        # Build configuration
        config_obj = Configuration.from_runnable_config({"configurable": run.config})
        
        # Execute graph with streaming
        async for event in graph.astream(
            {"messages": run.input_messages},
            config={
                "configurable": config_obj.model_dump(),
                "recursion_limit": config_obj.recursion_limit
            },
            stream_mode=["updates", "messages"]
        ):
            # Determine node name from event
            node_name = None
            if isinstance(event, dict):
                for key in event.keys():
                    if key not in ("__pregel_pull", "__pregel_push"):
                        node_name = key
                        break
            
            # Store event in Firestore
            await RunStore.add_event(run_id, event)
            
            # Update current node
            if node_name:
                await RunStore.update_status(run_id, "running", current_node=node_name)
            
            # Push to event queue for streaming reconnection
            queue = _event_queues.get(run_id)
            if queue:
                await queue.put(event)
            
            # Extract final state if this is finalize_answer
            if node_name == "finalize_answer" and isinstance(event.get(node_name), dict):
                node_data = event[node_name]
                if "messages" in node_data:
                    output_messages = [
                        {"role": "assistant", "content": str(m.content) if hasattr(m, "content") else str(m)}
                        for m in node_data["messages"]
                    ]
                    await RunStore.update_status(
                        run_id, 
                        "running",
                        output_messages=output_messages,
                        usage_metadata=node_data.get("usage_metadata", {}),
                        sources_gathered=node_data.get("sources_gathered", {})
                    )
        
        # Mark as completed
        await RunStore.update_status(
            run_id, 
            "completed", 
            completed_at=datetime.now(timezone.utc)
        )
        logger.info(f"Run {run_id} completed successfully")
        
    except asyncio.CancelledError:
        await RunStore.update_status(run_id, "cancelled")
        logger.info(f"Run {run_id} was cancelled")
    except Exception as e:
        await RunStore.update_status(run_id, "failed", error=str(e))
        logger.error(f"Run {run_id} failed: {e}", exc_info=True)
    finally:
        # Signal end of stream
        queue = _event_queues.get(run_id)
        if queue:
            await queue.put(None)  # Sentinel value


def _cleanup_run(run_id: str) -> None:
    """Cleanup after run completes."""
    _active_runs.pop(run_id, None)
    _event_queues.pop(run_id, None)
    logger.debug(f"Cleaned up run {run_id}")


async def cancel_run(run_id: str) -> bool:
    """Cancel a running task."""
    task = _active_runs.get(run_id)
    if task and not task.done():
        task.cancel()
        return True
    return False


async def get_run_status(run_id: str) -> Optional[RunStatus]:
    """Get current status of a run from Firestore."""
    return await RunStore.load(run_id)


def is_run_active(run_id: str) -> bool:
    """Check if run is still executing in this instance."""
    task = _active_runs.get(run_id)
    return task is not None and not task.done()


async def stream_run_events(run_id: str) -> AsyncGenerator[dict, None]:
    """
    Stream events for a run. Works for both:
    - Active runs (yields events in real-time)
    - Completed runs (yields stored events from Firestore)
    """
    run = await RunStore.load(run_id)
    if not run:
        return
    
    # If run is already completed, yield stored events
    if run.status in ("completed", "failed", "cancelled"):
        for event in run.events:
            yield event.get("data", event)
        return
    
    # If run is active on this instance, stream from queue
    queue = _event_queues.get(run_id)
    if queue:
        while True:
            try:
                event = await asyncio.wait_for(queue.get(), timeout=60.0)
                if event is None:  # Sentinel
                    break
                yield event
            except asyncio.TimeoutError:
                if not is_run_active(run_id):
                    break
                yield {"keepalive": True}
    else:
        # Run is on another Cloud Run instance - poll Firestore
        last_event_count = 0
        while True:
            run = await RunStore.load(run_id)
            if not run or run.status in ("completed", "failed", "cancelled"):
                # Yield any remaining events
                for event in run.events[last_event_count:] if run else []:
                    yield event.get("data", event)
                break
            
            # Yield new events
            for event in run.events[last_event_count:]:
                yield event.get("data", event)
            last_event_count = len(run.events)
            
            await asyncio.sleep(1)  # Poll every second
```

---

## Fase 4: API Endpoints

### 4.1 Actualizar `app.py`

Agregar los nuevos endpoints:

```python
import json
import uuid
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse

from .run_manager import (
    start_run, 
    get_run_status, 
    cancel_run, 
    stream_run_events,
    is_run_active
)
from .run_store_firestore import RunStore

# ============================================================================
# ASYNC RUN ENDPOINTS
# ============================================================================

@app.post("/runs")
async def create_run(request: Request):
    """
    Start a new agent run in the background.
    Returns immediately with run_id.
    """
    body = await request.json()
    
    input_data = body.get("input", {})
    messages = input_data.get("messages", [])
    config = body.get("config", {}).get("configurable", {})
    thread_id = config.get("thread_id", str(uuid.uuid4()))
    
    run_id = await start_run(
        thread_id=thread_id,
        messages=messages,
        config=config,
        user_id=None  # TODO: Extract from auth token
    )
    
    return {"run_id": run_id, "thread_id": thread_id}


@app.get("/runs/{run_id}")
async def get_run(run_id: str):
    """Get the current status of a run."""
    run = await get_run_status(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return run.model_dump(mode="json")


@app.get("/runs/{run_id}/stream")
async def stream_run(run_id: str):
    """Stream events for a run (SSE)."""
    run = await get_run_status(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    
    async def event_generator():
        async for event in stream_run_events(run_id):
            yield f"data: {json.dumps(event, default=str)}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.post("/runs/{run_id}/cancel")
async def cancel_run_endpoint(run_id: str):
    """Cancel an active run."""
    success = await cancel_run(run_id)
    if not success:
        raise HTTPException(status_code=400, detail="Run not active or not found")
    return {"status": "cancelled"}


@app.get("/runs")
async def list_runs(limit: int = 50, user_id: str = None):
    """List recent runs."""
    runs = await RunStore.list_runs(user_id=user_id, limit=limit)
    return {
        "runs": [r.model_dump(mode="json") for r in runs]
    }
```

---

## Fase 5: Cleanup Automatico

### 5.1 Cloud Scheduler + Cloud Functions (Opcional)

Para limpiar runs antiguos automaticamente:

```python
# En Pulumi
cleanup_scheduler = gcp.cloudscheduler.Job(
    "runs-cleanup-scheduler",
    schedule="0 3 * * *",  # 3 AM daily
    time_zone="America/Sao_Paulo",
    http_target=gcp.cloudscheduler.JobHttpTargetArgs(
        http_method="POST",
        uri=pulumi.Output.concat(
            "https://", cloud_run_url, "/internal/cleanup-runs"
        ),
        oidc_token=gcp.cloudscheduler.JobHttpTargetOidcTokenArgs(
            service_account_email=cloud_run_service_account.email,
        ),
    ),
)
```

Agregar endpoint en `app.py`:

```python
@app.post("/internal/cleanup-runs")
async def cleanup_runs():
    """Internal endpoint for scheduled cleanup."""
    deleted = await RunStore.cleanup_old_runs(max_age_hours=48)
    return {"deleted": deleted}
```

---

## Resumen de Archivos a Crear/Modificar

### Backend (sarkome_backend_langchain)

| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `src/agent/run_store_firestore.py` | **Crear** | Cliente Firestore para runs |
| `src/agent/run_manager.py` | **Crear** | Ejecucion en background |
| `src/agent/app.py` | **Modificar** | Agregar endpoints `/runs/*` |
| `requirements.txt` | **Agregar** | `google-cloud-firestore>=2.16.0` |

### Infraestructura (Pulumi)

| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `deploy/__main__.py` | **Modificar** | Agregar Firestore + IAM |

---

## Estimacion de Costos (100 usuarios 24/7)

### Escenario: 100 usuarios haciendo 5 consultas/dia cada uno

| Recurso | Uso Mensual | Costo |
|---------|-------------|-------|
| **Firestore Writes** | 15,000/dia = 450,000/mes | Free (< 600K/mes) |
| **Firestore Reads** | 75,000/dia = 2.25M/mes | ~$6.75 |
| **Firestore Storage** | ~500MB (runs + eventos) | ~$0.09 |
| **Cloud Run** | Ya existente | $0 adicional |
| **Total Adicional** | | **~$7/mes** |

### Con Free Tier Activo

Los primeros 50K reads/dia y 20K writes/dia son **GRATIS**.

Para 100 usuarios con 5 queries/dia:
- Writes: 500/dia = **Gratis**
- Reads: 2,500/dia = **Gratis**

**Costo real estimado: $0-5/mes**

---

## Deployment

```bash
cd deploy/
pulumi up
```

Esto creara:
1. Firestore database (default)
2. Indexes para queries eficientes
3. IAM bindings para Cloud Run

---

## Testing Local

```bash
# Configurar credenciales de GCP
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
export GCP_PROJECT=tu-proyecto
export FIRESTORE_DATABASE="(default)"

# Ejecutar backend
cd src/
uvicorn agent.app:app --reload --port 8080

# Test: Crear run
curl -X POST http://localhost:8080/runs \
  -H "Content-Type: application/json" \
  -d '{"input": {"messages": [{"role": "user", "content": "Test"}]}, "config": {}}'

# Test: Verificar estado
curl http://localhost:8080/runs/{run_id}
```

---

**Siguiente paso:** Implementar el frontend siguiendo `IMPLEMENTATION_PLAN_FRONTEND.md`.
