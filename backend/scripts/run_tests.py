#!/usr/bin/env python3

import os
import sys
import subprocess
import argparse


def run_tests(test_type="all", verbose=False, coverage=False):
    """Run tests with different configurations"""

    base_dir = os.path.dirname(os.path.dirname(__file__))
    os.chdir(base_dir)

    cmd = ["python", "-m", "pytest"]

    if verbose:
        cmd.append("-v")

    if coverage:
        cmd.extend(["--cov=src", "--cov-report=html", "--cov-report=term"])

    if test_type == "unit":
        cmd.append("tests/unit/")
    elif test_type == "integration":
        cmd.append("tests/integration/")
    elif test_type == "all":
        cmd.append("tests/")
    else:
        print(f"Unknown test type: {test_type}")
        return False

    cmd.extend(["-x", "--tb=short"])

    print(f"Running command: {' '.join(cmd)}")

    try:
        result = subprocess.run(cmd, check=True)
        print("\n✅ All tests passed!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Tests failed with exit code {e.returncode}")
        return False
    except FileNotFoundError:
        print("❌ pytest not found. Please install it with: pip install pytest")
        return False


def main():
    parser = argparse.ArgumentParser(description="Run tests for the backend")
    parser.add_argument(
        "--type",
        choices=["unit", "integration", "all"],
        default="all",
        help="Type of tests to run"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Run tests in verbose mode"
    )
    parser.add_argument(
        "--coverage", "-c",
        action="store_true",
        help="Run tests with coverage report"
    )

    args = parser.parse_args()

    success = run_tests(
        test_type=args.type,
        verbose=args.verbose,
        coverage=args.coverage
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
