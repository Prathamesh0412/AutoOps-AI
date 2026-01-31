"""Runtime shims that keep third-party deps working on newer Python releases."""

from __future__ import annotations

import inspect
import typing


def _patch_forward_ref() -> None:
    forward_ref = getattr(typing, "ForwardRef", None)
    if forward_ref is None:
        return

    original = getattr(forward_ref, "_evaluate", None)
    if original is None:
        return

    parameters = tuple(inspect.signature(original).parameters.keys())
    if "recursive_guard" not in parameters:
        return  # running on a Python version whose signature is already compatible

    expects_type_params = "type_params" in parameters

    def _evaluate(self, globalns, localns, *args, **kwargs):  # type: ignore[override]
        recursive_guard = kwargs.pop("recursive_guard", None)
        type_params = None

        positional = list(args)
        if expects_type_params:
            type_params = positional.pop(0) if positional else None

        if recursive_guard is None:
            recursive_guard = positional.pop(0) if positional else set()

        if expects_type_params:
            return original(
                self,
                globalns,
                localns,
                type_params,
                recursive_guard=recursive_guard,
            )

        return original(self, globalns, localns, recursive_guard=recursive_guard)

    setattr(forward_ref, "_evaluate", _evaluate)


def apply_python_compat() -> None:
    """Apply all compatibility patches exactly once."""

    _patch_forward_ref()
