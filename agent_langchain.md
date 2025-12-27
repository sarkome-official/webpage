# Sarkome Agent Module (`src/agent`)

## Overview
This module constitutes the core intelligence layer of the Sarkome backend. It is architected to function as a stateful, reasoning agent capable of processing user inputs, maintaining context, and executing specialized tools.

The design follows a modular integration pattern, structured to support advanced workflows (e.g., LangGraph) where the agent's behavior is defined by a graph of nodes and edges, representing distinct reasoning steps and actions.

## Directory Structure & Components

The module is organized to separate concerns between network logic, state management, and cognitive resources.

### 1. Application Layer
*   **`app.py`**: The entry point for the service. It initializes a **Flask** application and defines the REST API endpoints. This layer handles incoming HTTP requests from the Sarkome Global Platform, orchestrates the agent's response, and manages cross-origin resource sharing (CORS).

### 2. Core Logic & State
*   **`state.py`**: Defines the `State` schema. This is the "memory" of the agent, responsible for tracking the conversation history, user context, and any intermediate data generated during the reasoning loop.
*   **`graph.py`**: Implements the structural logic for the agent's workflow. It manages the creation of nodes (processing steps) and edges (transitions), forming the backbone of the agent's decision-making process.

### 3. Capabilities & Configuration
*   **`tools_and_schemas.py`**: Acts as the registry for the agent's capabilities. It defines the schemas for tools that the agent can invoke (e.g., data retrieval, computation, API calls) and lists the available tools.
*   **`prompts.py`**: Centralizes the system prompts and response templates. This file dictates the agent's persona, instructional constraints, and standard interaction patterns (e.g., greetings, error handling).
*   **`configuration.py`**: Manages the runtime environment. It securely handles sensitive configuration details, such as API keys for **Google Gemini** and **LangSmith**, ensuring the agent operates with the necessary credentials.

### 4. Utilities
*   **`utils.py`**: A helper module containing shared functions for logging, data processing, and other common tasks utilized across the agent's components.

## Getting Started

### Prerequisites
Ensure that the backend dependencies are installed as per the root `requirements.txt`.

### Running the Agent
The agent is typically executed as part of the broader backend service. To run it independently for development:

```bash
python src/agent/app.py
```

The service will start on the configured port (default: 8000) and accept requests via the defined routes.

## Development Roadmap
This module is designed for extensibility:
*   **Logic Enhancement**: `graph.py` is the primary target for implementing complex reasoning loops (e.g., ReAct, Plan-and-Execute).
*   **Tool Integration**: New capabilities should be added to `tools_and_schemas.py` to expand the agent's skillset.
*   **Prompt Tuning**: Refine `prompts.py` to specialize the agent's responses for the Sarkome scientific domain.
