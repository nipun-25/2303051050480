# Stage 1

## Core Actions Identified
To support a robust campus notification platform, the system must handle the following core actions for an authenticated user:
1. **Fetch Notifications:** Retrieve a paginated list of notifications, with the ability to filter by type (Event, Result, Placement).
2. **Fetch Unread Count:** Get a quick integer count of unread notifications for badge icons in the UI.
3. **Mark as Read (Single):** Update the status of a specific notification to read once the user clicks it.
4. **Mark All as Read:** Bulk update all unread notifications to read.

---

## REST API Endpoints & Contracts

### 1. Fetch Notifications
Retrieves a paginated list of notifications for the logged-in user.

* **Endpoint:** `GET /api/v1/notifications`
* **Headers:** * `Authorization: Bearer <token>`
* **Query Parameters:**
  * `page` (integer, default: 1)
  * `limit` (integer, default: 20)
  * `notification_type` (string, optional: "Event", "Result", "Placement")
* **Response (200 OK):**
```json
{
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100
  },
  "notifications": [
    {
      "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "type": "Result",
      "message": "mid-sem",
      "timestamp": "2026-04-22 17:51:30",
      "is_read": false
    }
  ]
}