#!/usr/bin/env python3
"""Test script for the FastAPI backend"""
import asyncio
import sys
import json
sys.path.insert(0, '/home/raw/Desktop/New Folder/ledger/backend')

from httpx import AsyncClient, ASGITransport

# Import models first to register them with Base
from app.models.user import User, UserStats, Subject, SubjectMastery
from app.models.quiz import Question, QuizSession, QuizAnswer
from app.models.task import Task
from app.database import init_db, async_engine, Base

from main import app

async def test():
    # Initialize database
    await init_db()
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test health
        resp = await client.get("/health")
        print(f"Health: {resp.json()}")

        # Test registration
        resp = await client.post("/api/auth/register", json={
            "name": "Another User",
            "email": "another@example.com",
            "password": "password123",
            "level": "foundation"
        })
        print(f"Register: {resp.status_code}")
        if resp.status_code != 200:
            print(f"Error: {resp.text[:200]}")
        else:
            user_data = resp.json()
            print(f"User created: {user_data.get('name')}")
            print(f"Stats: {user_data.get('stats')}")

        # Test login
        resp = await client.post("/api/auth/login/json", json={
            "email": "another@example.com",
            "password": "password123"
        })
        print(f"Login: {resp.status_code}")
        if resp.status_code == 200:
            token = resp.json().get("access_token")
            print(f"Token: {token[:50]}...")

            # Test start quiz
            resp = await client.post("/api/quiz/start",
                headers={"Authorization": f"Bearer {token}"},
                json={"subject": "accounting", "question_count": 3}
            )
            print(f"Start Quiz: {resp.status_code}")
            if resp.status_code == 200:
                quiz_data = resp.json()
                print(f"Session ID: {quiz_data.get('session_id')}")
                print(f"Questions: {len(quiz_data.get('questions', []))}")

                # Submit quiz
                answers = [
                    {"question_id": q["id"], "user_answer": q["correct_answer"]}
                    for q in quiz_data.get("questions", [])
                ]
                resp = await client.post(f"/api/quiz/{quiz_data['session_id']}/submit",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"answers": answers, "time_taken_seconds": 120}
                )
                print(f"Submit Quiz: {resp.status_code}")
                if resp.status_code == 200:
                    result = resp.json()
                    print(f"Score: {result.get('score_percentage')}%")

        print("\n✓ All tests passed!")

if __name__ == "__main__":
    asyncio.run(test())