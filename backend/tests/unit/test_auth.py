import base64
import json
from unittest.mock import patch

import pytest
from fastapi import HTTPException, status

from entities.user import User
from helpers.auth import get_user, _decode_jwt_payload


class TestAuthHelpers:
    def test_decode_jwt_payload_valid(self):
        payload = {"sub": "user123", "email": "test@example.com", "name": "Test User"}
        payload_json = json.dumps(payload)
        payload_bytes = payload_json.encode('utf-8')
        payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode('utf-8').rstrip('=')

        jwt_token = f"header.{payload_b64}.signature"

        result = _decode_jwt_payload(jwt_token)

        assert result["sub"] == "user123"
        assert result["email"] == "test@example.com"
        assert result["name"] == "Test User"

    def test_decode_jwt_payload_invalid_format(self):
        with pytest.raises(ValueError, match="Invalid JWT token format"):
            _decode_jwt_payload("invalid.token")

    def test_decode_jwt_payload_invalid_json(self):
        invalid_payload = "invalid-json"
        payload_bytes = invalid_payload.encode('utf-8')
        payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode('utf-8').rstrip('=')

        jwt_token = f"header.{payload_b64}.signature"

        with pytest.raises(ValueError, match="Failed to decode JWT payload"):
            _decode_jwt_payload(jwt_token)

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_success_with_oid(self, mock_decode):
        mock_decode.return_value = {
            "oid": "user123",
            "preferred_username": "test@example.com",
            "name": "Test User"
        }

        result = get_user("mock_token")

        assert isinstance(result, User)
        assert result.id == "user123"
        assert result.email == "test@example.com"
        assert result.name == "Test User"
        assert result.role == "admin"

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_success_with_sub(self, mock_decode):
        mock_decode.return_value = {
            "sub": "user123",
            "email": "test@example.com",
            "name": "Test User"
        }

        result = get_user("mock_token")

        assert isinstance(result, User)
        assert result.id == "user123"
        assert result.email == "test@example.com"
        assert result.name == "Test User"

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_success_with_upn(self, mock_decode):
        mock_decode.return_value = {
            "sub": "user123",
            "upn": "test@example.com",
            "name": "Test User"
        }

        result = get_user("mock_token")

        assert isinstance(result, User)
        assert result.email == "test@example.com"

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_success_with_given_family_name(self, mock_decode):
        mock_decode.return_value = {
            "sub": "user123",
            "email": "test@example.com",
            "given_name": "John",
            "family_name": "Doe"
        }

        result = get_user("mock_token")

        assert isinstance(result, User)
        assert result.name == "John Doe"

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_missing_user_id(self, mock_decode):
        mock_decode.return_value = {
            "email": "test@example.com",
            "name": "Test User"
        }

        with pytest.raises(HTTPException) as exc_info:
            get_user("mock_token")

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Could not extract user ID from token" in exc_info.value.detail

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_missing_email(self, mock_decode):
        mock_decode.return_value = {
            "sub": "user123",
            "name": "Test User"
        }

        with pytest.raises(HTTPException) as exc_info:
            get_user("mock_token")

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Could not extract email from token" in exc_info.value.detail

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_invalid_token_format(self, mock_decode):
        mock_decode.side_effect = ValueError("Invalid token format")

        with pytest.raises(HTTPException) as exc_info:
            get_user("mock_token")

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid token format" in exc_info.value.detail

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_general_exception(self, mock_decode):
        mock_decode.side_effect = Exception("General error")

        with pytest.raises(HTTPException) as exc_info:
            get_user("mock_token")

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Could not validate credentials" in exc_info.value.detail

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_empty_name(self, mock_decode):
        mock_decode.return_value = {
            "sub": "user123",
            "email": "test@example.com",
            "name": ""
        }

        result = get_user("mock_token")

        assert isinstance(result, User)
        assert result.name == ""

    @patch('src.helpers.auth._decode_jwt_payload')
    def test_get_user_none_name(self, mock_decode):
        mock_decode.return_value = {
            "sub": "user123",
            "email": "test@example.com",
            "name": None
        }

        result = get_user("mock_token")

        assert isinstance(result, User)
        assert result.name == ""
