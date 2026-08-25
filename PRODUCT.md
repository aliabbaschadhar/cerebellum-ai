# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Knowledge workers, software engineers, researchers, and creators who continuously encounter high-value content across the web (X/Twitter threads, GitHub repositories and documentation, YouTube videos and podcasts, Reddit discussions, LinkedIn essays, and articles) and need a frictionless way to save, organize, and recall it.

## Product Purpose

Cerebellum AI is an intelligent second brain that universally captures content across web platforms, automatically extracts metadata and transcripts, indexes the material into a vector database with pgvector, and enables natural language semantic search and conversational retrieval.

## Positioning

Unlike traditional bookmark managers that store static URLs in rigid folder hierarchies, Cerebellum AI combines in-feed browser clippers with automated multimodal ingestion (transcripts, site metadata, author context, and user notes) and vector-based semantic retrieval so users can ask natural language questions and recall insights effortlessly.

## Operating Context

- Browsing workflow: Saving articles, videos, and social posts on the fly using the browser extension or floating in-page clipper.
- App interface: Reviewing saved knowledge cards, filtering by platform (YouTube, X, GitHub, Reddit, Instagram, LinkedIn), querying knowledge via AI search, and synthesizing connected ideas.
- Integration points: Chrome extension with background API synchronization (`/api/links`), PostgreSQL database with `pgvector` embeddings, and Next.js 15 web application.

## Capabilities and Constraints

- Capabilities:
  - Universal Chrome extension clipper (Toolbar Popup + In-Page Floating Drawer + Social In-Feed Injectors).
  - Automated link metadata scraping, YouTube video transcription indexing, and embedding generation.
  - Semantic vector search powered by embeddings in PostgreSQL / Neon DB.
  - Interactive web dashboard with neumorphic cards, platform filters, and AI assistant view.
- Constraints:
  - Requires local/remote Next.js backend and PostgreSQL instance with `vector` extension enabled.
  - Background processes depend on valid API endpoints and network connectivity.

## Brand Commitments

- Name: Cerebellum AI
- Core Motif: Intelligent Second Brain / Neural Synapses
- Tone: Thoughtful, focused, cerebral, and empowering.
- Design System: Warm Neumorphic interface (`#e0e5ec`, soft dual shadows, coral `#c94045` primary accents, Plus Jakarta Sans & Libre Caslon typography).

## Evidence on Hand

- Next.js 15 application codebase with landing page and dashboard components (`src/`).
- Database schema with `Link` and `LinkEmbedding` models (`prisma/schema.prisma`).
- Fully functional Chrome Extension with Manifest V3 (`chrome-extension/`).
- Real social platform connectors and script injectors for X, LinkedIn, YouTube, GitHub, Reddit, Instagram, Medium, Hashnode, TikTok.

## Product Principles

1. **Frictionless Capture**: Saving knowledge should take a single click from within the user's natural reading flow without interrupting context.
2. **Intent-Driven Recall**: Users should find saved items by describing what they remember, not by guessing exact titles or hunting through nested folders.
3. **Multimodal Depth**: Beyond saving a URL, the system indexes the underlying essence (transcripts, key points, author context, user notes).
4. **Calm & Tactile Aesthetics**: Provide a focused, distraction-free environment utilizing tactile neumorphic surfaces that feel organic and deliberate.

## Accessibility & Inclusion

- High contrast text readability against neumorphic surfaces with accessible focus outlines and keyboard navigation.
- Accessible semantic HTML with ARIA labels on extension triggers and interactive components.
