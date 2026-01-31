# AI Action Agent Backend

This FastAPI service orchestrates the business workflow for the Action Agent while delegating language understanding to an external LLM.

## Stack
- FastAPI for the HTTP layer and dependency injection
- SQLAlchemy ORM targeting SQLite by default (swap `DATABASE_URL` for PostgreSQL/MySQL)
- Pydantic schemas for request/response validation
- httpx client for LLM calls with deterministic fallbacks

## Getting Started
1. `cd backend`
2. `python -m venv .venv && .venv\Scripts\activate` (or your preferred env manager)
3. `pip install -r requirements.txt`
4. `uvicorn backend.main:app --reload`

The service exposes:
- `POST /api/messages` to ingest a message and trigger decisioning
- `GET /api/messages` to list recent messages with AI annotations
- `GET /api/actions` to view pending/closed actions
- `POST /api/actions/{id}/approve` to simulate human approval and execution

### Demo Data
```
python -m backend.scripts.seed_demo
```
Run this after the first server boot to populate a handful of customers/messages so the React dashboard has content immediately.

### Tests
```
pytest backend/tests/test_end_to_end.py
```
This covers the MVP flow: message ingestion → automatic action creation → approval → execution.

## Configuration
Set environment variables in a `.env` file if needed:
```
DATABASE_URL=sqlite:///./action_agent.db
AI_BASE_URL=https://your-llm-endpoint
AI_API_KEY=sk-your-key
```
The bundled heuristic fallback keeps the system demo-ready even without an external LLM.

## Architecture Overview
```
backend/
├── ai/            # Prompt + httpx client for the LLM
├── models/        # SQLAlchemy entities (Customer, Message, Action)
├── schemas/       # Pydantic DTOs for clean APIs
├── services/      # Deterministic orchestration logic
├── routers/       # FastAPI routers wiring HTTP to services
├── database.py    # Engine + Session factory + Base
├── config.py      # Environment-aware settings
└── main.py        # FastAPI app & middleware bootstrap
```
The separation keeps AI reasoning, business rules, and transport concerns isolated so the system behaves as a decision engine, not a chatbot server.
