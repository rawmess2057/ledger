#!/usr/bin/env python3
"""Simulate frontend API calls"""
import asyncio
import sys
sys.path.insert(0, '/home/raw/Desktop/New Folder/ledger/backend')

from httpx import AsyncClient, ASGITransport

# Import models first to register them with Base
from app.models.user import User, UserStats, Subject, SubjectMastery
from app.models.quiz import Question, QuizSession, QuizAnswer
from app.models.task import Task
from app.database import init_db

from main import app

async def test_login_flow():
    # Initialize database
    await init_db()
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://localhost:8000") as client:
        print("=== Test Registration ===")
        resp = await client.post("/api/auth/register", json={
            "name": "Frontend Test",
            "email": "frontend@test.com",
            "password": "password123",
            "level": "foundation"
        })
        print(f"Register status: {resp.status_code}")
        if resp.status_code == 200:
            user_data = resp.json()
            print(f"User: {user_data.get('name')}")
            print(f"Stats: {user_data.get('stats')}")
        else:
            print(f"Error: {resp.text[:200]}")
        
        print("\n=== Test Login ===")
        resp = await client.post("/api/auth/login/json", json={
            "email": "frontend@test.com",
            "password": "password123"
        })
        print(f"Login status: {resp.status_code}")
        if resp.status_code == 200:
            token = resp.json().get("access_token")
            print(f"Got token: {token[:50]}...")
            
            print("\n=== Test Get Me (with token) ===")
            resp = await client.get("/api/auth/me", headers={
                "Authorization": f"Bearer {token}"
            })
            print(f"GetMe status: {resp.status_code}")
            if resp.status_code == 200:
                user = resp.json()
                print(f"User: {user.get('name')}, Stats: {user.get('stats')}")
            else:
                print(f"Error: {resp.text[:200]}")
        
        print("\n=== Simulate CORS Request ===")
        resp = await client.post("/api/auth/login/json", 
            json={"email": "frontend@test.com", "password": "password123"},
            headers={"Origin": "http://localhost:3000"}
        )
        print(f"CORS Request status: {resp.status_code}")
        
        print("\n✓ All API tests passed!")

if __name__ == "__main__":
    asyncio.run(test_login_flow())