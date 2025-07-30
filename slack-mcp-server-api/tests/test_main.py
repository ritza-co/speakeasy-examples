import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import HTTPException
import sys
import os

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))

from main import app, get_slack_client

client = TestClient(app)


@pytest.fixture
def mock_slack_client():
    """Mock Slack WebClient for testing"""
    client = Mock()
    client.auth_test.return_value = {"ok": True, "user": "test_user"}
    return client


@pytest.fixture
def auth_headers():
    """Authentication headers for testing"""
    return {"Authorization": "Bearer xoxb-test-token"}


class TestHealthCheck:
    def test_health_check(self):
        """Test the health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestAuthentication:
    def test_missing_authorization_header(self):
        """Test request without authorization header"""
        response = client.get("/messages/search?query=test")
        assert response.status_code == 403

    def test_invalid_authorization_format(self):
        """Test request with invalid authorization format"""
        headers = {"Authorization": "Invalid token"}
        response = client.get("/messages/search?query=test", headers=headers)
        assert response.status_code == 403

    @patch("main.WebClient")
    def test_invalid_slack_token(self, mock_webclient):
        """Test request with invalid Slack token"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": False}
        mock_webclient.return_value = mock_client

        headers = {"Authorization": "Bearer xoxb-invalid-token"}
        response = client.get("/messages/search?query=test", headers=headers)
        assert response.status_code == 401


class TestMessageSearch:
    @patch("main.WebClient")
    def test_search_messages_success(self, mock_webclient, auth_headers):
        """Test successful message search"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.search_messages.return_value = {
            "ok": True,
            "messages": {
                "matches": [
                    {
                        "ts": "1234567890.123456",
                        "text": "Test message",
                        "user": "U1234567890",
                        "channel": {"id": "C1234567890"},
                        "thread_ts": None,
                        "reply_count": 0,
                    }
                ],
                "total": 1,
            },
        }
        mock_webclient.return_value = mock_client

        response = client.get("/messages/search?query=test", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["messages"]) == 1
        assert data["total"] == 1
        assert data["messages"][0]["text"] == "Test message"

    @patch("main.WebClient")
    def test_search_messages_with_filters(self, mock_webclient, auth_headers):
        """Test message search with filters"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.search_messages.return_value = {
            "ok": True,
            "messages": {"matches": [], "total": 0},
        }
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/search?query=test&channel=C1234567890&user=U1234567890&limit=10",
            headers=auth_headers,
        )
        assert response.status_code == 200

        # Verify the search query was built correctly
        mock_client.search_messages.assert_called_once()
        call_args = mock_client.search_messages.call_args
        assert "test" in call_args.kwargs["query"]
        assert "in:#C1234567890" in call_args.kwargs["query"]
        assert "from:@U1234567890" in call_args.kwargs["query"]

    @patch("main.WebClient")
    def test_search_messages_api_error(self, mock_webclient, auth_headers):
        """Test message search with Slack API error"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.search_messages.return_value = {
            "ok": False,
            "error": "invalid_query",
        }
        mock_webclient.return_value = mock_client

        response = client.get("/messages/search?query=test", headers=auth_headers)
        assert response.status_code == 400


class TestThreadOperations:
    @patch("main.WebClient")
    def test_get_thread_success(self, mock_webclient, auth_headers):
        """Test successful thread retrieval"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_replies.return_value = {
            "ok": True,
            "messages": [
                {
                    "ts": "1234567890.123456",
                    "text": "Parent message",
                    "user": "U1234567890",
                    "thread_ts": "1234567890.123456",
                    "reply_count": 1,
                },
                {
                    "ts": "1234567890.123457",
                    "text": "Reply message",
                    "user": "U0987654321",
                    "thread_ts": "1234567890.123456",
                },
            ],
        }
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/C1234567890/1234567890.123456/thread", headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["parent_message"]["text"] == "Parent message"
        assert len(data["replies"]) == 1
        assert data["replies"][0]["text"] == "Reply message"
        assert data["reply_count"] == 1

    @patch("main.WebClient")
    def test_get_thread_not_found(self, mock_webclient, auth_headers):
        """Test thread retrieval when thread doesn't exist"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_replies.return_value = {"ok": True, "messages": []}
        mock_webclient.return_value = mock_client

        response = client.get(
            "/messages/C1234567890/1234567890.123456/thread", headers=auth_headers
        )
        assert response.status_code == 404


class TestUserOperations:
    @patch("main.WebClient")
    def test_get_user_success(self, mock_webclient, auth_headers):
        """Test successful user retrieval"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.users_info.return_value = {
            "ok": True,
            "user": {
                "id": "U1234567890",
                "name": "testuser",
                "real_name": "Test User",
                "is_bot": False,
                "profile": {"email": "test@example.com", "display_name": "Test"},
            },
        }
        mock_webclient.return_value = mock_client

        response = client.get("/users/U1234567890", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "U1234567890"
        assert data["name"] == "testuser"
        assert data["real_name"] == "Test User"
        assert data["email"] == "test@example.com"
        assert data["is_bot"] is False

    @patch("main.WebClient")
    def test_get_user_not_found(self, mock_webclient, auth_headers):
        """Test user retrieval when user doesn't exist"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.users_info.return_value = {"ok": False, "error": "user_not_found"}
        mock_webclient.return_value = mock_client

        response = client.get("/users/U1234567890", headers=auth_headers)
        assert response.status_code == 404


class TestChannelOperations:
    @patch("main.WebClient")
    def test_list_channels_success(self, mock_webclient, auth_headers):
        """Test successful channel listing"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}

        # Mock different responses for public and private channels
        def mock_conversations_list(**kwargs):
            types = kwargs.get("types", "")
            if "private_channel" in types:
                return {
                    "ok": True,
                    "channels": [
                        {
                            "id": "G1234567890",
                            "name": "private-team",
                            "is_private": True,
                            "is_archived": False,
                            "num_members": 3,
                            "topic": {"value": "Private team discussion"},
                            "purpose": {"value": "Team coordination"},
                        }
                    ],
                }
            else:  # public channels
                return {
                    "ok": True,
                    "channels": [
                        {
                            "id": "C1234567890",
                            "name": "general",
                            "is_private": False,
                            "is_archived": False,
                            "num_members": 10,
                            "topic": {"value": "General discussion"},
                            "purpose": {"value": "Company-wide announcements"},
                        },
                        {
                            "id": "C0987654321",
                            "name": "random",
                            "is_private": False,
                            "is_archived": False,
                            "num_members": 5,
                            "topic": {"value": "Random stuff"},
                            "purpose": {"value": "Off-topic discussion"},
                        },
                    ],
                }

        mock_client.conversations_list.side_effect = mock_conversations_list
        mock_webclient.return_value = mock_client

        response = client.get("/channels", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3  # 2 public + 1 private

        # Find the general channel in the results
        general_channel = next((ch for ch in data if ch["name"] == "general"), None)
        assert general_channel is not None
        assert general_channel["member_count"] == 10

    @patch("main.WebClient")
    def test_get_channel_messages_success(self, mock_webclient, auth_headers):
        """Test successful channel message retrieval"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_history.return_value = {
            "ok": True,
            "messages": [
                {
                    "ts": "1234567890.123456",
                    "text": "Hello world",
                    "user": "U1234567890",
                    "reply_count": 0,
                },
                {
                    "ts": "1234567890.123455",
                    "text": "Previous message",
                    "user": "U0987654321",
                    "reply_count": 0,
                },
            ],
        }
        mock_webclient.return_value = mock_client

        response = client.get("/channels/C1234567890/messages", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["text"] == "Hello world"

    @patch("main.WebClient")
    def test_get_channel_messages_not_in_channel(self, mock_webclient, auth_headers):
        """Test channel message retrieval when bot is not in channel"""
        mock_client = Mock()
        mock_client.auth_test.return_value = {"ok": True}
        mock_client.conversations_history.return_value = {
            "ok": False,
            "error": "not_in_channel",
        }
        mock_webclient.return_value = mock_client

        response = client.get("/channels/C1234567890/messages", headers=auth_headers)
        assert response.status_code == 403
