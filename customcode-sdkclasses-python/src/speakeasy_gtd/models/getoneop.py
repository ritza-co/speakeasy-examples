"""Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT."""

from __future__ import annotations
from speakeasy_gtd.types import BaseModel
from speakeasy_gtd.utils import FieldMetadata, PathParamMetadata
from typing_extensions import Annotated, TypedDict


class GetOneRequestTypedDict(TypedDict):
    id: str


class GetOneRequest(BaseModel):
    id: Annotated[
        str, FieldMetadata(path=PathParamMetadata(style="simple", explode=False))
    ]
