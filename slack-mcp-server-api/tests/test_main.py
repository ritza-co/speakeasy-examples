import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from app.main import app, SlackMessage, SlackUser, SlackChannel


# Test client
client = TestClient(app)

# Mock data
MOCK_SLACK_MESSAGE = {
    "ts": "1234567890.123456",
    "text": "Test message",
    "user": "U1234567890",
    "channel": {"id": "C1234567890"},
    "thread_ts": None,
    "reply_count": 0,
}

MOCK_SLACK_USER = {
    "id": "U1234567890",
    "name": "testuser",
    "real_name": "Test User",
    "profile": {"email": "test@example.com"},
    "is_bot": False,
}

MOCK_SLACK_CHANNEL = {
    "id": "C1234567890",
    "name": "general",
    "is_private": False,
    "is_archived": False,
    "num_members": 10,
    "topic": {"value": "General discussion"},
    "purpose": {"value": "Company-wide announcements and work-based matters"},
}

# Mock Slack event data
MOCK_URL_VERIFICATION_EVENT = {
    "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
    "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
    "type": "url_verification"
}

MOCK_EVENT_CALLBACK = {
    "token": "verification_token_here",
    "team_id": "T1D9317P4",
    "api_app_id": "A0118NQPB1Y",
    "event": {
        "type": "message",
        "user": "U1234567890",
        "text": "Hello world",
        "ts": "1234567890.123456",
        "channel": "C1234567890"
    },
    "type": "event_callback",
    "event_id": "Ev08MFMKH6",
    "event_time": 1234567890
}


class TestHealthEndpoint:
    """Test the health check endpoint"""

    def test_health_check_success(self):
        """Test successful health check"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestSlackEventsEndpoint:
    """Test the Slack Events API endpoint"""

    def test_url_verification_success(self):
        """Test successful URL verification event"""
        response = client.post("/events", json=MOCK_URL_VERIFICATION_EVENT)
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/plain"
        assert response.text == MOCK_URL_VERIFICATION_EVENT["challenge"]

    def test_url_verification_missing_fields(self):
        """Test URL verification with missing required fields"""
        incomplete_event = {
            "type": "url_verification",
            "token": "some_token"
            # Missing challenge field
        }
        response = client.post("/events", json=incomplete_event)
        assert response.status_code == 200  # We return 200 to prevent Slack retries
        data = response.json()
        assert data["status"] == "error"

    def test_event_callback_success(self):
        """Test successful event callback handling"""
        response = client.post("/events", json=MOCK_EVENT_CALLBACK)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"

    def test_unknown_event_type(self):
        """Test handling of unknown event types"""
        unknown_event = {
            "type": "unknown_event_type",
            "token": "some_token"
        }
        response = client.post("/events", json=unknown_event)
        assert response.status_code == 400
        data = response.json()
        assert data["error"] == "Unknown event type"

    def test_invalid_json_payload(self):
        """Test handling of invalid JSON payload"""
        response = client.post(
            "/events", 
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 200  # We return 200 to prevent Slack retries
        data = response.json()
        assert data["status"] == "error"

    def test_events_endpoint_not_in_openapi(self):
        """Test that events endpoint is excluded from OpenAPI schema"""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        openapi_data = response.json()
        
        # Check that /events is not in the paths
        assert "/events" not in openapi_data.get("paths", {})


class TestAuthentication:
    """Test authentication and authorization"""

    def test_missing_authorization_header(self):
        """Test endpoint access without authorization header"""
        response = client.get("/messages/search?query=test")
        assert response.status_code == 403

    @patch("app.main.WebClient")
    def test_invalid_token(self, mock_webclient):
        """Test endpoint access with invalid token"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": False}
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/search?query=test",
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401


class TestMessageSearch:
    """Test message search functionality"""

    @patch("app.main.WebClient")
    def test_search_messages_success(self, mock_webclient):
        """Test successful message search"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.search_messages.return_value = {
            "ok": True,
            "messages": {"matches": [MOCK_SLACK_MESSAGE], "total": 1},
        }
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/search?query=test",
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["messages"]) == 1
        assert data["total"] == 1
        assert data["has_more"] is False

    @patch("app.main.WebClient")
    def test_search_messages_with_filters(self, mock_webclient):
        """Test message search with additional filters"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.search_messages.return_value = {
            "ok": True,
            "messages": {"matches": [], "total": 0},
        }
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/search?query=test&channel=C1234567890&user=U1234567890&limit=10",
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 200
        # Verify the search query was built with filters
        mock_client.search_messages.assert_called_once()

    @patch("app.main.WebClient")
    def test_search_messages_api_error(self, mock_webclient):
        """Test message search with Slack API error"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.search_messages.return_value = {"ok": False, "error": "invalid_auth"}
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/search?query=test",
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 400


class TestThreadOperations:
    """Test thread-related operations"""

    @patch("app.main.WebClient")
    def test_get_thread_success(self, mock_webclient):
        """Test successful thread retrieval"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_replies.return_value = {
            "ok": True,
            "messages": [MOCK_SLACK_MESSAGE],
        }
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/C1234567890/1234567890.123456/thread",
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "parent_message" in data
        assert "replies" in data
        assert "reply_count" in data

    @patch("app.main.WebClient")
    def test_get_thread_not_found(self, mock_webclient):
        """Test thread retrieval when thread doesn't exist"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_replies.return_value = {"ok": True, "messages": []}
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/C1234567890/1234567890.123456/thread",
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 404


class TestUserOperations:
    """Test user-related operations"""

    @patch("app.main.WebClient")
    def test_get_user_success(self, mock_webclient):
        """Test successful user retrieval"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.users_info.return_value = {"ok": True, "user": MOCK_SLACK_USER}
        mock_webclient.return_value = mock_client

        response = client.get(
            "/users/U1234567890", headers={"Authorization": "Bearer valid-token"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "U1234567890"
        assert data["name"] == "testuser"

    @patch("app.main.WebClient")
    def test_get_user_not_found(self, mock_webclient):
        """Test user not found error"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.users_info.return_value = {"ok": False, "error": "user_not_found"}
        mock_webclient.return_value = mock_client

        response = client.get(
            "/users/U9999999999", headers={"Authorization": "Bearer valid-token"}
        )
        assert response.status_code == 404


class TestChannelOperations:
    """Test channel-related operations"""

    @patch("app.main.WebClient")
    def test_list_channels_success(self, mock_webclient):
        """Test successful channel listing"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        
        # Use side_effect to return different data for public and private channels
        mock_client.conversations_list.side_effect = [
            {"ok": True, "channels": [MOCK_SLACK_CHANNEL, MOCK_SLACK_CHANNEL]},  # Public channels
            {"ok": True, "channels": [MOCK_SLACK_CHANNEL]},  # Private channels
        ]
        mock_webclient.return_value = mock_client

        response = client.get(
            "/channels", headers={"Authorization": "Bearer valid-token"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3  # 2 public + 1 private
        assert all("id" in channel for channel in data)
        assert all("name" in channel for channel in data)

    @patch("app.main.WebClient")
    def test_get_channel_messages_success(self, mock_webclient):
        """Test successful channel message retrieval"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_history.return_value = {
            "ok": True,
            "messages": [MOCK_SLACK_MESSAGE],
        }
        mock_webclient.return_value = mock_client

        response = client.get(
            "/channels/C1234567890/messages",
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["ts"] == "1234567890.123456"

    @patch("app.main.WebClient")
    def test_get_channel_messages_not_in_channel(self, mock_webclient):
        """Test channel message retrieval when bot is not in channel"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_history.return_value = {
            "ok": False,
            "error": "not_in_channel",
        }
        mock_webclient.return_value = mock_client

        response = client.get(
            "/channels/C1234567890/messages",
            headers={"Authorization": "Bearer valid-token"},
        )
        assert response.status_code == 403
