/**
 * Manual Testing Guide for Authentication System
 * 
 * Run these tests after `npx prisma generate` to ensure everything works:
 */

// Test 1: Registration
/*
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "name": "Test User",
  "password": "password123"
}

Expected: 201 status, user object, session cookie set
*/

// Test 2: Login
/*
POST http://localhost:3000/api/auth/login  
Content-Type: application/json

{
  "email": "test@example.com", 
  "password": "password123"
}

Expected: 200 status, user object, session cookie set
*/

// Test 3: Check Authentication Status
/*
GET http://localhost:3000/api/auth/me
(with session cookie from login/register)

Expected: 200 status, user object
*/

// Test 4: Get User Rooms
/*
GET http://localhost:3000/api/rooms
(with session cookie)

Expected: 200 status, empty array initially
*/

// Test 5: Create Room  
/*
POST http://localhost:3000/api/rooms
Content-Type: application/json
(with session cookie)

{
  "name": "Test Room"
}

Expected: 201 status, room object with userId
*/

// Test 6: Rate Limiting
/*
POST http://localhost:3000/api/auth/login
(make 6+ rapid requests with wrong credentials)

Expected: 429 status after 5 attempts
*/

// Test 7: Logout
/*
POST http://localhost:3000/api/auth/logout

Expected: 200 status, session cookie cleared
*/
