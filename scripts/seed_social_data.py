#!/usr/bin/env python3
import os
import sys
import json
import uuid
import subprocess
from datetime import datetime, timezone

# 1. Load DATABASE_URL from .env if present
env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
database_url = "postgresql://postgres:postgres@localhost:5432/brainery"

if os.path.exists(env_file):
    with open(env_file, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("DATABASE_URL="):
                database_url = line.split("DATABASE_URL=", 1)[1].strip('"').strip("'")
                break

print(f"📡 Using Database URL: {database_url}")

# 2. Define 10 rich social link items
mock_social_links = [
    {
        "id": "cuid-yt-huberman-01",
        "url": "https://www.youtube.com/watch?v=gfd359",
        "platform": "youtube",
        "title": "Andrew Huberman: Master Your Dopamine Baseline & Focus Systems",
        "description": "Comprehensive podcast protocol covering dopamine release, motivation mechanics, and morning sunlight protocols for optimal cognitive output.",
        "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
        "favicon": "https://www.youtube.com/favicon.ico",
        "siteName": "youtube.com",
        "aiContext": "Dopamine protocols & cognitive baseline optimization.",
    },
    {
        "id": "cuid-tw-naval-02",
        "url": "https://x.com/naval/status/17823901",
        "platform": "twitter",
        "title": "Naval Ravikant: How to Get Rich Without Getting Lucky (Thread)",
        "description": "Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Code and media are permissionless leverage.",
        "image": "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80",
        "favicon": "https://abs.twimg.com/favicons/twitter.3.ico",
        "siteName": "x.com",
        "aiContext": "Permissionless leverage & wealth creation principles.",
    },
    {
        "id": "cuid-gh-react-03",
        "url": "https://github.com/facebook/react",
        "platform": "github",
        "title": "facebook/react: The library for web and native user interfaces",
        "description": "React is a JavaScript library for building user interfaces with declarative component architectures and concurrent engine support.",
        "image": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
        "favicon": "https://github.githubassets.com/favicons/favicon.png",
        "siteName": "github.com",
        "aiContext": "React 19 concurrent features & server components.",
    },
    {
        "id": "cuid-rd-agents-04",
        "url": "https://www.reddit.com/r/MachineLearning/comments/ai_agents/",
        "platform": "reddit",
        "title": "r/MachineLearning: Autonomous AI Agents & Vector RAG Architectures in 2026",
        "description": "A deep dive into multi-agent orchestration frameworks, subagent tool calls, and low-latency local vector indexing.",
        "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        "favicon": "https://www.redditstatic.com/shreddit/assets/favicon/192x192.png",
        "siteName": "reddit.com",
        "aiContext": "AI Agent orchestration & vector retrieval systems.",
    },
    {
        "id": "cuid-ig-design-05",
        "url": "https://www.instagram.com/p/design_systems/",
        "platform": "instagram",
        "title": "Minimalist Neumorphic & Modern Web Design Trends",
        "description": "Curated collection of soft neumorphic shadows, glassmorphism card layouts, and responsive bento grid showcases.",
        "image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
        "favicon": "https://static.cdninstagram.com/rsrc.php/y4/r/80PAt2p6Wd0.ico",
        "siteName": "instagram.com",
        "aiContext": "UI/UX design trends & neumorphic design systems.",
    },
    {
        "id": "cuid-sb-packy-06",
        "url": "https://packy.substack.com/p/the-second-brain-revolution",
        "platform": "generic",
        "title": "Not Boring: The Second Brain Revolution & Semantic Neural Search",
        "description": "How personal knowledge graphs, automated indexing, and conversational AI are replacing traditional bookmark folders.",
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        "favicon": "https://substack.com/favicon.ico",
        "siteName": "substack.com",
        "aiContext": "Semantic indexing & knowledge graph analysis.",
    },
    {
        "id": "cuid-md-vectordb-07",
        "url": "https://medium.com/engineering/building-fast-vector-databases",
        "platform": "generic",
        "title": "Building High-Performance Local Vector DBs in TypeScript & Rust",
        "description": "Optimizing HNSW graphs, cosine similarity calculations, and persistent WebAssembly vector indices.",
        "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
        "favicon": "https://medium.com/favicon.ico",
        "siteName": "medium.com",
        "aiContext": "HNSW vector graphs & WebAssembly database speed.",
    },
    {
        "id": "cuid-tt-nextjs-08",
        "url": "https://www.tiktok.com/@techtrends/video/991823",
        "platform": "generic",
        "title": "TechTrends: 60-Second Breakdown of Next.js 16 Turbopack",
        "description": "Quick breakdown of server actions, streaming SSR, and instant Turbopack compilation speeds.",
        "image": "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=80",
        "favicon": "https://www.tiktok.com/favicon.ico",
        "siteName": "tiktok.com",
        "aiContext": "Next.js 16 Turbopack performance analysis.",
    },
    {
        "id": "cuid-li-aieng-09",
        "url": "https://www.linkedin.com/posts/ai-engineering-future",
        "platform": "generic",
        "title": "LinkedIn Engineering: Scale Multi-Agent Systems in Production",
        "description": "Best practices for asynchronous message passing, subagent orchestration, and real-time state persistence.",
        "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        "favicon": "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzvxho",
        "siteName": "linkedin.com",
        "aiContext": "Production AI Agent architecture & state persistence.",
    },
    {
        "id": "cuid-dev-prisma-10",
        "url": "https://dev.to/fullstack/prisma-postgresql-vector-embeddings",
        "platform": "generic",
        "title": "Dev.to: Integrating pgvector Extensions with Prisma 6 & Next.js",
        "description": "Complete tutorial on setting up pgvector in Docker PostgreSQL containers for native semantic search.",
        "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        "favicon": "https://dev.to/favicon.ico",
        "siteName": "dev.to",
        "aiContext": "Prisma pgvector integration & Next.js fullstack setup.",
    }
]

# 3. Generate SQL script content
sql_statements = []
sql_statements.append("-- Social Links Seed SQL\n")

# Zero vector of length 384 for LinkEmbedding compatibility
zero_vector = "[" + ",".join(["0.0"] * 384) + "]"

now_iso = datetime.now(timezone.utc).isoformat()

for link in mock_social_links:
    # Escape single quotes in SQL string values
    link_id = link["id"].replace("'", "''")
    url = link["url"].replace("'", "''")
    platform = link["platform"].replace("'", "''")
    title = link["title"].replace("'", "''")
    description = link["description"].replace("'", "''")
    image = link["image"].replace("'", "''")
    favicon = link["favicon"].replace("'", "''")
    site_name = link["siteName"].replace("'", "''")
    ai_context = link["aiContext"].replace("'", "''")

    insert_link_sql = f"""
INSERT INTO "Link" ("id", "url", "platform", "title", "description", "image", "favicon", "siteName", "aiContext", "createdAt")
VALUES ('{link_id}', '{url}', '{platform}', '{title}', '{description}', '{image}', '{favicon}', '{site_name}', '{ai_context}', '{now_iso}')
ON CONFLICT ("id") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "image" = EXCLUDED."image",
  "siteName" = EXCLUDED."siteName",
  "aiContext" = EXCLUDED."aiContext";
"""
    sql_statements.append(insert_link_sql)

    embed_id = f"emb-{link_id}"
    insert_embed_sql = f"""
INSERT INTO "LinkEmbedding" ("id", "linkId", "vector")
VALUES ('{embed_id}', '{link_id}', '{zero_vector}'::vector)
ON CONFLICT ("linkId") DO NOTHING;
"""
    sql_statements.append(insert_embed_sql)

full_sql = "\n".join(sql_statements)

# Save to temporary SQL file
sql_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seed_social_data.sql")
with open(sql_file_path, "w") as f:
    f.write(full_sql)

print(f"📄 SQL script written to: {sql_file_path}")

# 4. Attempt execution via psycopg2 or docker exec / psql
executed = False

try:
    import psycopg2
    print("🔌 Connecting via psycopg2...")
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    cursor.execute(full_sql)
    conn.commit()
    cursor.close()
    conn.close()
    print("✅ Successfully seeded 10 social app link nodes into PostgreSQL via psycopg2!")
    executed = True
except Exception as e:
    print(f"⚠️ psycopg2 connection direct execution note: {e}")

if not executed:
    # Try psql command directly or via docker exec
    try:
        print("🚀 Executing SQL via psql command...")
        cmd = f"psql '{database_url}' -f '{sql_file_path}'"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Successfully seeded 10 social app link nodes into PostgreSQL via psql CLI!")
            executed = True
        else:
            print(f"⚠️ psql output: {result.stderr or result.stdout}")
    except Exception as e:
        print(f"⚠️ psql command error: {e}")

if not executed:
    # Try docker exec psql if running in Docker container
    try:
        print("🐳 Attempting execution inside running Docker postgres container...")
        cmd = f"docker exec -i $(docker ps -q -f name=postgres) psql -U postgres -d brainery < '{sql_file_path}'"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Successfully seeded 10 social app link nodes into Docker PostgreSQL container!")
            executed = True
        else:
            print(f"⚠️ Docker psql output: {result.stderr or result.stdout}")
    except Exception as e:
        print(f"⚠️ Docker execution error: {e}")

if executed:
    print("\n🎉 Social mock dataset successfully populated! Open http://localhost:3000/app to test.")
else:
    print(f"\n💡 Database connection pending. You can run the generated SQL file directly:\n   psql '{database_url}' -f '{sql_file_path}'")
